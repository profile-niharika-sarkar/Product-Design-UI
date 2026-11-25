#!/usr/bin/env python3
"""Collect page evidence for a UX audit.

Input modes (pick one):
  collect.py URL                      fetch over HTTP (+ robots.txt, sitemap)
  collect.py URL --render             render in headless Chromium (JS sites, screenshots, console errors, mobile overflow)
  collect.py --html FILE [--base-url URL]   a saved HTML file
  collect.py --serve DIR [--render]   serve a built site folder (e.g. a Vite dist/) locally and audit it
  collect.py --text FILE              pasted page text when fetching is blocked (partial evidence only)

Output: evidence JSON (stdout, or -o FILE). With --render, screenshots go to --assets DIR.
The JSON is raw evidence for the model to judge; it does not score anything.
Standard library only, except --render which shells out to tools/render.cjs (Node + Playwright).
"""
from __future__ import annotations

import argparse
import functools
import http.server
import json
import re
import socketserver
import subprocess
import sys
import tempfile
import threading
import urllib.error
import urllib.request
from collections import Counter
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

HERE = Path(__file__).resolve().parent
UA = "Mozilla/5.0 (compatible; ux-audit-agent/1.0)"

CTA_CLASS = re.compile(r"\b(btn|button|cta|wp-block-button)", re.I)
# Utility-CSS buttons (Tailwind etc.): a filled background plus padding or rounding.
UTILITY_BUTTON = re.compile(r"(?=.*\bbg-(?!transparent))(?=.*\b(px-|py-|rounded))", re.I)
CTA_WORDS = re.compile(r"\b(book|start|get|try|discover|contact|schedule|request|join|sign ?up|download|let'?s go|learn more|talk|buy|demo|inquire|apply|subscribe|explore|call)\b", re.I)
GENERIC_ANCHOR = re.compile(r"^(click here|here|learn more|read more|more|link)$", re.I)
FILENAME_ALT = re.compile(r"^[\w\- ]*\.(png|jpe?g|gif|webp|svg)$|^(img|image|dsc|screenshot|photo)[\s_\-]?\d*$|^\d+$", re.I)
STOCK_ALT = re.compile(r"\b(young|asian?|business(wo)?man|smiling|stock|portrait of|happy|isolated on|concept|people working|student study)\b", re.I)
STAT = re.compile(r"(?<![\w.])(\d{1,3}(?:[.,]\d+)?\s?%|\d+(?:\.\d+)?\s?[xX]\b|\$\s?\d[\d,.]*\s?[kKmMbB]?|\d{2,3},\d{3}\+?|\d+\+\s+\w+)")
COPYRIGHT = re.compile(r"(?:©|&copy;|copyright)\s*(?:©)?\s*(\d{4})(?:\s*[-–]\s*(\d{4}))?", re.I)
DATE = re.compile(r"\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2},?\s+20\d{2}\b|\b20\d{2}-\d{2}-\d{2}\b")
PRICING = re.compile(r"(\$|£|€|₹|USD|per month|/mo\b|per seat|pricing|starting at|from \$|retainer|packages?|plans?\b|free trial)", re.I)
PLACEHOLDER = re.compile(r"lorem ipsum|coming soon|placeholder|todo|tbd|your (text|title) here|sample text", re.I)
SOCIAL = {"linkedin.com": "LinkedIn", "twitter.com": "X/Twitter", "x.com": "X/Twitter", "facebook.com": "Facebook",
          "instagram.com": "Instagram", "youtube.com": "YouTube", "tiktok.com": "TikTok", "medium.com": "Medium",
          "substack.com": "Substack", "github.com": "GitHub"}
EMBEDS = {"calendly": "Calendly", "cal.com": "Cal.com", "hubspot": "HubSpot", "typeform": "Typeform", "elevenlabs": "ElevenLabs",
          "youtube": "YouTube", "vimeo": "Vimeo", "intercom": "Intercom", "drift": "Drift", "tawk": "Tawk", "google.com/maps": "Google Maps",
          "acuityscheduling": "Acuity", "tidycal": "TidyCal", "zcal": "zcal"}


class Extractor(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, dict]] = []
        self.title = ""
        self.meta: dict[str, str] = {}
        self.og: dict[str, str] = {}
        self.links_rel: dict[str, str] = {}
        self.lang = None
        self.headings: list[dict] = []
        self.anchors: list[dict] = []
        self.buttons: list[dict] = []
        self.images: list[dict] = []
        self.forms: list[dict] = []
        self.iframes: list[str] = []
        self.scripts_src: list[str] = []
        self.jsonld_raw: list[str] = []
        self.text_chunks: list[str] = []
        self._cur_text: list[list[str]] = []  # text collectors for open a/h/button/title/script
        self._in = Counter()
        self._form = None

    # helpers
    def _open_collector(self):
        self._cur_text.append([])

    def _close_collector(self) -> str:
        return re.sub(r"\s+", " ", "".join(self._cur_text.pop())).strip() if self._cur_text else ""

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        for buf in self._cur_text:  # keep words in <span>Word</span><span>Word</span> apart
            buf.append(" ")
        if tag not in self.VOID:
            self.stack.append((tag, a))
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "meta":
            name = (a.get("name") or a.get("property") or "").lower()
            if name.startswith("og:"):
                self.og[name] = a.get("content", "")
            elif name:
                self.meta[name] = a.get("content", "")
        elif tag == "link" and a.get("rel"):
            self.links_rel[a["rel"].lower()] = a.get("href", "")
        elif tag in ("title", "h1", "h2", "h3", "a", "button", "script", "label", "nav", "footer", "header", "style", "noscript"):
            self._in[tag] += 1
            if tag in ("title", "h1", "h2", "h3", "a", "button", "script", "label"):
                self._open_collector()
            if tag == "a":
                self.anchors.append({"href": a.get("href", ""), "class": a.get("class", ""), "target": a.get("target", ""),
                                     "aria": a.get("aria-label", ""), "in_nav": self._in["nav"] > 0 or self._in["header"] > 0,
                                     "in_footer": self._in["footer"] > 0, "text": ""})
            if tag == "button":
                self.buttons.append({"class": a.get("class", ""), "type": a.get("type", ""), "aria": a.get("aria-label", ""), "text": ""})
            if tag == "script":
                if a.get("src"):
                    self.scripts_src.append(a["src"])
                self._script_type = a.get("type", "")
        elif tag == "img":
            self.images.append({"src": a.get("src") or a.get("data-src", ""), "alt": a.get("alt"), "role": a.get("role", ""),
                                "in_link": self._in["a"] > 0})
        elif tag == "iframe":
            self.iframes.append(a.get("src") or a.get("data-src", ""))
        elif tag == "form":
            self._form = {"action": a.get("action", ""), "fields": [], "unlabeled": 0}
            self.forms.append(self._form)
        elif tag in ("input", "select", "textarea") and self._form is not None:
            if a.get("type") in ("hidden", "submit", "button"):
                return
            label = a.get("aria-label") or a.get("placeholder") or a.get("name") or a.get("id") or a.get("type", tag)
            self._form["fields"].append(label)
            if not (a.get("aria-label") or a.get("id") or a.get("aria-labelledby")) and self._in["label"] == 0:
                self._form["unlabeled"] += 1

    def handle_endtag(self, tag):
        for buf in self._cur_text:
            buf.append(" ")
        if tag in ("title", "h1", "h2", "h3", "a", "button", "script", "label", "nav", "footer", "header", "style", "noscript"):
            if self._in[tag] <= 0:
                return
            self._in[tag] -= 1
            if tag in ("title", "h1", "h2", "h3", "a", "button", "script", "label"):
                text = self._close_collector()
                if tag == "title" and not self.title:
                    self.title = text
                elif tag in ("h1", "h2", "h3"):
                    self.headings.append({"level": tag, "text": text})
                elif tag == "a" and self.anchors:
                    for anc in reversed(self.anchors):
                        if not anc["text"]:
                            anc["text"] = text or anc["aria"]
                            break
                elif tag == "button" and self.buttons:
                    self.buttons[-1]["text"] = text or self.buttons[-1]["aria"]
                elif tag == "script" and "ld+json" in getattr(self, "_script_type", ""):
                    self.jsonld_raw.append(text)
        if tag == "form":
            self._form = None
        while self.stack:
            t, _ = self.stack.pop()
            if t == tag:
                break

    def handle_data(self, data):
        if self._in["style"] or (self._in["script"] and "ld+json" not in getattr(self, "_script_type", "")):
            return
        for buf in self._cur_text:
            buf.append(data)
        if not self._in["script"] and data.strip():
            self.text_chunks.append(data.strip())


def classify_href(href: str, base: str) -> str:
    if not href or href.startswith("javascript:"):
        return "none"
    if href.startswith("#"):
        return "anchor"
    if href.startswith("mailto:"):
        return "mailto"
    if href.startswith("tel:"):
        return "tel"
    if not base:
        return "external" if urlparse(href).netloc else "internal"
    full = urlparse(urljoin(base, href))
    b = urlparse(base)
    if full.netloc and full.netloc.replace("www.", "") != b.netloc.replace("www.", ""):
        return "external"
    if full.path.rstrip("/") == b.path.rstrip("/") and full.fragment:
        return "anchor"
    return "internal"


def jsonld_types(raw: list[str]) -> list[str]:
    types = []

    def walk(o):
        if isinstance(o, dict):
            t = o.get("@type")
            if t:
                types.extend(t if isinstance(t, list) else [t])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for r in raw:
        try:
            walk(json.loads(r))
        except json.JSONDecodeError:
            types.append("INVALID_JSON")
    return sorted(set(types))


def analyse(html: str, base_url: str = "") -> dict:
    p = Extractor()
    p.feed(html)
    text = " ".join(p.text_chunks)
    year = date.today().year

    # headings
    h_counts = Counter(h["level"] for h in p.headings)
    norm = Counter(h["text"].lower() for h in p.headings if h["text"])
    dup = sorted(t for t, n in norm.items() if n > 1)

    # links & CTAs
    links = []
    for a in p.anchors:
        kind = classify_href(a["href"], base_url)
        resolved = urljoin(base_url, a["href"]) if base_url and kind not in ("mailto", "tel", "none") else a["href"]
        is_cta = bool(CTA_CLASS.search(a["class"])) or bool(UTILITY_BUTTON.search(a["class"]) and a["text"]) or (bool(CTA_WORDS.search(a["text"] or "")) and len(a["text"] or "") <= 40 and not a["in_footer"])
        links.append({"text": a["text"][:100], "href": resolved, "kind": kind, "cta": is_cta, "nav": a["in_nav"], "footer": a["in_footer"]})
    ctas = [l for l in links if l["cta"]] + [{"text": b["text"][:100], "href": "(button)", "kind": "button", "cta": True, "nav": False, "footer": False}
                                              for b in p.buttons if b["text"] and not re.search(r"toggle|menu|close|prev|next", b["text"] + b["aria"], re.I)]
    nav = [l for l in links if l["nav"] and l["text"]]
    kinds = Counter(l["kind"] for l in links)
    ext_domains = Counter(urlparse(l["href"]).netloc for l in links if l["kind"] == "external")
    internal_pages = sorted({urlparse(l["href"]).path or "/" for l in links if l["kind"] == "internal"})
    generic_anchor = sorted({l["text"] for l in links if GENERIC_ANCHOR.match(l["text"] or "")})

    # images
    imgs = []
    for im in p.images:
        alt = im["alt"]
        if alt is None:
            status = "missing"
        elif not alt.strip():
            status = "empty"
        elif FILENAME_ALT.search(alt.strip()):
            status = "filename"
        elif STOCK_ALT.search(alt):
            status = "stock-like"
        else:
            status = "ok"
        imgs.append({"src": im["src"].split("?")[0][-80:], "alt": alt, "status": status})
    img_counts = Counter(i["status"] for i in imgs)

    # embeds
    embed_hits = sorted({name for src in p.iframes + p.scripts_src for key, name in EMBEDS.items() if key in src.lower()})
    ext_tool_links = sorted({name for l in links for key, name in EMBEDS.items() if key in l["href"].lower() and l["kind"] == "external"})

    # stats with nearby source markers
    stats = []
    for m in STAT.finditer(text):
        ctx = text[max(0, m.start() - 90): m.end() + 90]
        sourced = bool(re.search(r"(source|according to|study|survey|report|\[\d+\]|\*|based on|n\s?=)", ctx, re.I))
        stats.append({"value": m.group(0).strip(), "context": ctx.strip(), "source_nearby": sourced})

    copyright_years = [int(m.group(2) or m.group(1)) for m in COPYRIGHT.finditer(text)]
    social = sorted({name for l in links for dom, name in SOCIAL.items() if dom in l["href"]})
    legal = sorted({l["text"] for l in links if re.search(r"privacy|terms|cookie|legal|imprint", l["text"] + l["href"], re.I)})
    contact = {"mailto": sorted({l["href"][7:] for l in links if l["kind"] == "mailto"}),
               "tel": sorted({l["href"][4:] for l in links if l["kind"] == "tel"})}

    first_h1 = next((h["text"] for h in p.headings if h["level"] == "h1"), "")
    return {
        "title": {"text": p.title, "length": len(p.title)},
        "meta_description": {"text": p.meta.get("description", ""), "length": len(p.meta.get("description", ""))},
        "canonical": p.links_rel.get("canonical", ""),
        "robots_meta": p.meta.get("robots", ""),
        "lang": p.lang,
        "viewport": p.meta.get("viewport", ""),
        "og": p.og,
        "headings": {"counts": dict(h_counts), "h1": [h["text"] for h in p.headings if h["level"] == "h1"],
                     "outline": [f"{h['level']}: {h['text'][:100]}" for h in p.headings][:60], "duplicates": dup},
        "hero_text": first_h1,
        "nav": [{"text": l["text"], "href": l["href"], "kind": l["kind"]} for l in nav][:20],
        "ctas": [{"text": c["text"], "href": c["href"], "kind": c["kind"]} for c in ctas][:40],
        "links": {"counts": dict(kinds), "external_domains": dict(ext_domains.most_common(15)), "internal_pages": internal_pages[:80],
                  "generic_anchor_text": generic_anchor},
        "images": {"total": len(imgs), "counts": dict(img_counts), "items": imgs[:60]},
        "jsonld_types": jsonld_types(p.jsonld_raw),
        "forms": p.forms,
        "embeds": {"iframes_or_scripts": embed_hits, "external_tool_links": ext_tool_links, "iframe_srcs": p.iframes[:10]},
        "skip_link": any(re.search(r"skip", l["text"] or "", re.I) and l["kind"] == "anchor" for l in links),
        "stats": stats[:40],
        "copyright": {"years": copyright_years, "current_year": year,
                      "outdated": bool(copyright_years) and max(copyright_years) < year},
        "dates_found": sorted(set(DATE.findall(text)))[-10:],
        "pricing_terms": sorted({m.group(0).lower() for m in PRICING.finditer(text)})[:15],
        "placeholders": sorted({m.group(0) for m in PLACEHOLDER.finditer(text)}),
        "social_links": social,
        "legal_links": legal,
        "contact": contact,
        "word_count": len(text.split()),
        "text_excerpt": text[:6000],
    }


def fetch(url: str, timeout: int = 25) -> tuple[int, str, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        body = r.read(3_000_000).decode(r.headers.get_content_charset() or "utf-8", "replace")
        return r.status, r.geturl(), body


def site_files(url: str) -> dict:
    out = {}
    root = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
    for name, path in (("robots_txt", "/robots.txt"), ("sitemap", "/sitemap.xml"), ("wp_sitemap", "/wp-sitemap.xml")):
        try:
            status, _, body = fetch(root + path, 15)
            entry = {"status": status, "bytes": len(body)}
            if name == "robots_txt":
                entry["disallow"] = re.findall(r"(?im)^disallow:\s*(\S+)", body)[:20]
                entry["sitemaps"] = re.findall(r"(?im)^sitemap:\s*(\S+)", body)
            else:
                entry["loc_count"] = len(re.findall(r"<loc>", body))
            out[name] = entry
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            out[name] = {"error": str(e)[:200]}
    return out


def render(url: str, assets: Path) -> tuple[dict, str]:
    proc = subprocess.run(["node", str(HERE / "render.cjs"), url, str(assets)], capture_output=True, text=True, timeout=180)
    if proc.returncode != 0 or not proc.stdout.strip():
        raise RuntimeError(f"render failed: {proc.stderr[-500:]}")
    info = json.loads(proc.stdout.strip().splitlines()[-1])
    html_path = assets / "rendered.html"
    html = html_path.read_text(encoding="utf-8") if html_path.exists() else ""
    return info, html


class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve(directory: str) -> tuple[socketserver.TCPServer, str]:
    handler = functools.partial(_Quiet, directory=directory)
    srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}/"


def from_text(text: str) -> dict:
    """Pasted-text mode: only text-derived signals are available."""
    stats = []
    for m in STAT.finditer(text):
        ctx = text[max(0, m.start() - 90): m.end() + 90]
        stats.append({"value": m.group(0).strip(), "context": " ".join(ctx.split()),
                      "source_nearby": bool(re.search(r"(source|according to|study|survey|\[\d+\]|based on)", ctx, re.I))})
    years = [int(m.group(2) or m.group(1)) for m in COPYRIGHT.finditer(text)]
    return {"stats": stats[:40], "copyright": {"years": years, "current_year": date.today().year,
            "outdated": bool(years) and max(years) < date.today().year},
            "dates_found": sorted(set(DATE.findall(text)))[-10:], "pricing_terms": sorted({m.group(0).lower() for m in PRICING.finditer(text)}),
            "placeholders": sorted({m.group(0) for m in PLACEHOLDER.finditer(text)}), "word_count": len(text.split()),
            "text_excerpt": text[:8000],
            "not_observable": ["meta tags", "headings markup", "link targets", "alt text", "structured data", "mobile layout"]}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("url", nargs="?")
    ap.add_argument("--html")
    ap.add_argument("--serve", help="directory of a built site to serve locally")
    ap.add_argument("--text")
    ap.add_argument("--base-url", default="")
    ap.add_argument("--render", action="store_true")
    ap.add_argument("--assets", help="where screenshots/rendered.html go (default: temp dir)")
    ap.add_argument("-o", "--out")
    a = ap.parse_args(argv)

    ev: dict = {"collected_at": date.today().isoformat(), "collector": "ux-audit-agent/collect.py"}
    assets = Path(a.assets) if a.assets else Path(tempfile.mkdtemp(prefix="ux-audit-"))
    srv = None
    try:
        if a.text:
            ev.update(input_mode="text", source=a.text, **from_text(Path(a.text).read_text(encoding="utf-8")))
        elif a.html:
            ev.update(input_mode="html", source=a.html, base_url=a.base_url,
                      **analyse(Path(a.html).read_text(encoding="utf-8", errors="replace"), a.base_url))
        else:
            url = a.url
            if a.serve:
                srv, url = serve(a.serve)
                ev["served_from"] = a.serve
            if not url:
                ap.error("give a URL, --html, --serve or --text")
            if a.render or a.serve:
                info, html = render(url, assets)
                ev.update(input_mode="rendered", url=info.get("final_url", url), render=info, assets_dir=str(assets),
                          **analyse(html, info.get("final_url", url)))
            else:
                status, final, html = fetch(url)
                ev.update(input_mode="url", url=final, http_status=status, **analyse(html, final))
            if not a.serve:
                ev["site_files"] = site_files(ev.get("url", url))
    except (urllib.error.URLError, OSError, RuntimeError) as e:
        ev.update(error=str(e)[:400], fallback="Fetching failed. Ask for screenshots or pasted page text and rerun with --text / --html.")
        print(json.dumps(ev, indent=2), file=sys.stderr)
        return 3
    finally:
        if srv:
            srv.shutdown()

    out = json.dumps(ev, indent=2, ensure_ascii=False)
    if a.out:
        Path(a.out).write_text(out, encoding="utf-8")
        print(f"wrote {a.out}")
    else:
        print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())

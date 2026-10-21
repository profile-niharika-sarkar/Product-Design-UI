import React from 'react';
import { Facebook, Instagram, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-brand-purple/10 blur-[120px]" />
        <div className="absolute bottom-8 right-8 w-[260px] h-[260px] rounded-full bg-brand-pink/8 blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div>
            <h4 className="text-white text-xl font-bold mb-4">
              We're Media 21
            </h4>

            <p className="text-zinc-400 leading-relaxed">
              We are a team of individuals who are dedicated to growing,
              nurturing and sustaining brands. To achieve this goal, we
              leverage our varied expertise time and again.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white text-xl font-bold mb-4">
              Get in touch
            </h4>

            <div className="space-y-3 text-zinc-400">
              <p>603-604, Majan I tower, Ghala</p>

              <p>
                <a
                  href="tel:+96891229053"
                  className="hover:text-white transition"
                >
                  +968 9122 9053
                </a>
              </p>

              <p>
                <a
                  href="mailto:sales@media21world.com"
                  className="hover:text-white transition"
                >
                  sales@media21world.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="relative flex flex-col items-start md:items-start text-left md:text-left pl-0">
            <div className="flex flex-wrap justify-start gap-3 mb-6 w-full">
              <a
                href="https://marketing.m21world.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold uppercase text-sm whitespace-nowrap"
              >
                Marketing
              </a>

              <a
                href="https://drive.google.com/file/d/19KJ-sSMCn9Kk7bymoFQVCNkODjdPQqxk/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold uppercase text-sm whitespace-nowrap"
              >
                Portfolio
              </a>
            </div>

            {/* Follow Us */}
            <div className="flex items-center gap-7 mb-3 flex-wrap">
              <h4 className="text-white text-base md:text-lg font-semibold">
                Follow us on
              </h4>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/dentsum21om/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>

              <a
                href="https://www.instagram.com/media21_oman/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>

              <a
                href="https://www.linkedin.com/company/dentsu_m21/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back To Top */}
        <button
          onClick={scrollToTop}
          className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-center text-zinc-500 hover:text-white transition"
        >
          <span className="[writing-mode:vertical-lr] rotate-180 text-xs tracking-[0.3em]">
            BACK UP TOP
          </span>

          <ArrowUp size={14} className="mt-2" />
        </button>
      </div>
    </footer>
  );
}

Add a new screen to the Nexus web app: $ARGUMENTS

Before writing code, give me a short plan covering:
1. Route path and where it sits in the sidebar groups in AppShell.tsx.
2. Data it needs: existing API endpoints, or new ones (types go in packages/shared first).
3. Components it reuses from apps/web/src/components.
4. How it handles loading, empty, error and permission-denied states (StateView.tsx).
5. Any AI-related content and which TrustTag state applies.
6. Analytics events it should fire (add them to docs/UI_SPEC.md).

Wait for my approval. After building, run `npm run check` and update docs/UI_SPEC.md.

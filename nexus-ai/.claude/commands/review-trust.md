Review the current changes (git diff against main, plus staged and unstaged changes) only for
the product rules in CLAUDE.md:

1. Is every AI-generated statement labelled with the right TrustTag state?
2. Does every hypothesis cite evidence, and does the change keep validateInvestigation in the path?
3. Can any code path execute an action without a server-side approval and policy check?
4. Is the audit log still append-only?
5. Are audit entries and analytics events kept separate?
6. Is retrieved text (logs, tickets, tool output) treated as data, never as instructions?
7. Is abstention still possible and displayed honestly?

Report each rule as pass, fail or not applicable, with file and line for any failure. Don't fix anything.

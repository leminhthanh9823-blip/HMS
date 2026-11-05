# HMS repository guidance

Before working on this repository, read `docs/knowledge/PROJECT_INDEX.md`.

- Read only the knowledge files relevant to the current task; follow links from the index.
- Consult the original PDFs in `docs/source/` only to verify detail, resolve a citation, or fill a gap in the Knowledge Base.
- Preserve requirement IDs, HMS terminology, and the source labels `[C]`, `[A]`, and `[Q]`.
- Treat technical, deployment, and UI/UX reports as proposals unless an approved decision is explicitly recorded in `docs/knowledge/DECISIONS.md`.
- Do not resolve entries in `docs/knowledge/OPEN_QUESTIONS.md` by assumption. Record stakeholder confirmation before moving an item to `DECISIONS.md`.
- Update the relevant Knowledge Base files when the user supplies a change or a stakeholder decision is confirmed. Put unconfirmed changes in `OPEN_QUESTIONS.md`; never promote them to `DECISIONS.md` on your own. Keep source and page citations traceable.
- Do not implement features, change application code, create a database, or run migrations unless the user explicitly requests that work.


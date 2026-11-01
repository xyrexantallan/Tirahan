# Contributing

## Branch Naming
- Features: `feature/<issue-number>-<short-name>`
- Fixes: `fix/<issue-number>-<short-name>`
- Docs: `docs/<short-name>`

Examples:
- `feature/12-tenant-crud`
- `fix/34-meter-validation`
- `docs/tech-stack-section`

## Commits
Use conventional commit prefixes:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `chore:` — setup, config, dependencies
- `test:` — tests only

Reference the related issue number:
- `feat(#12): implement tenant CRUD`
- `fix(#34): correct meter reading validation`

## Pull Requests
1. Open PR against `main`.
2. Reference the issue with `Closes #<number>` in the description.
3. Assign a peer reviewer (not yourself).
4. Wait for approval and pass all checks before merging.

## Rules
- Never commit `.env` or real secrets.
- Every task needs an owner and acceptance criteria before it enters "In Progress."
- Every feature must be reviewed by a different team member before merging.
- Every change to `main` must go through a pull request.
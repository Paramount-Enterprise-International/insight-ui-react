# Filename audit

Type suffixes are removed when the folder already identifies the role. Public exports are unchanged.

| Previous path | Current path |
|---|---|
| `src/components/auth/auth.service.ts` | `src/components/auth/auth.ts` |
| `src/components/csrf/csrf.service.ts` | `src/components/csrf/csrf.ts` |
| `src/components/session/session.service.test.ts` | `src/components/session/session.test.ts` |
| `src/components/session/session.service.ts` | `src/components/session/session.ts` |
| `src/components/session-expired/session-expired.service.test.ts` | `src/components/session-expired/session-expired.test.ts` |
| `src/components/session-expired/session-expired.service.ts` | `src/components/session-expired/session-expired.ts` |
| `src/components/storage/storage.service.ts` | `src/components/storage/storage.ts` |
| `src/components/store/user-menu.store.test.ts` | `src/components/store/user-menu.test.ts` |
| `src/components/store/user-menu.store.ts` | `src/components/store/user-menu.ts` |
| `src/components/user/current-user.service.ts` | `src/components/user/current-user.ts` |
| `src/components/user/user-menu.service.test.ts` | `src/components/user/user-menu.test.ts` |
| `src/components/user/user-menu.service.ts` | `src/components/user/user-menu.ts` |

## Retained names

- `.types`, `.config`, `.mapper`, `.context`, `.spec`, and `.test` distinguish file responsibilities.
- Angular root files `highlight-search.pipe.ts` and `truncated-tooltip.directive.ts` retain suffixes because the root provides no type context.
- API client filenames retain `.client` to distinguish the client role from error helpers.
- Feature, component, provider, and dialog names remain descriptive; no public symbols or selectors were renamed.

# React + TypeScript + Vite

## Routes protected by authorization codes

Import `hasMn` from the package root and declare a check alongside the route:

```tsx
{ path: 'reports', element: hasMn('app.reports', createElement(Reports)) }
{ path: 'reports/:id', loadComponent: hasMn('app.reports', () =>
  import('./Report').then((m) => m.Report)) }
```

The helper uses the same code shorthand, ANY array input, and authorization
predicate evaluator as `IHasMn`. It waits for session/authorization readiness, loads cold
authorizations, and renders Unauthorized Access in place when access is denied. Lazy page
imports run only after access is granted. `IRouter` updates denial metadata and
restores route title/breadcrumbs on grant or navigation. Declare child checks
separately; implicit index checks do not protect sibling child pages.

Routes without the helper stay available; unknown routes use the router's 404.
For buttons and ordinary UI fragments, `IHasMn`/`INotHasMn` retain hide-only behavior.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Authorization codes and navigation

`GET {api.user}/me/applications/:applicationId/authorizations` is the only source
of access codes for `hasMn`, UI gates, hooks, and code-based guards. The service
unwraps `data`; the store retains `authorizations` and derives the unique
`menuCodes` from both `item` and `function` entries. `/menus` remains the source
of the navigation tree, sidebar, routes, icons, and favorite flags.

The predicate source contains `menuCodes`, `roles`, `companies`, `companyCodes`,
and `menuCompanies`. Companies are unique by id; company codes are unique;
`menuCompanies[code]` contains the companies granted specifically for that code.
For company-scoped access, check that mapping instead of the global company union.

`store.hasMenuCode(code)` checks authorizations with ANY-match for arrays.
`store.hasNavigableMenu(code)` checks navigation leaf codes from `/menus`.
`store.hasRoute(path)` checks routes from the same navigation tree.
`store.loadAuthorizations(applicationId?)` clears stale authorization data,
fetches new entries, and returns the authorization DTO array. The application id
falls back to the configured `appId`; absent ids fail before sending the request.

During a full store load, both positive and inverse UI gates stay hidden and
the React hook returns false. Once loading settles, inverse gates render when
the check is false. An authorization failure empties access codes and company
scope, records `loadErrors.authorizations`, and leaves other load branches
independent. Role predicates still read token roles. There is no fallback to
navigation codes. Route helpers retain their existing loading and in-place 403
behavior, and only activate guarded content after access is granted.

Code-based `requireAccess` / `IRequireAccess` use `source: 'menuCode'` or `'role'`;
React defaults to `'menuCode'`. Code guards wait for the cold-start store load.
Backend endpoints and enforcement remain unchanged.

### Breaking migration

| Previous API | Replacement |
| --- | --- |
| `source.menu`, `source.permission` | `source.menuCodes` from authorizations |
| `store.permissions`, Angular `permissions$` | `store.menuCodes`, Angular `menuCodes$` |
| `hasPermission()` | `hasMenuCode()` |
| `hasMenu()` | `hasMenuCode()` for access; `hasNavigableMenu()` for navigation |
| `loadPermissions()` | `loadAuthorizations()` returning authorization DTOs |
| `loadErrors.permissions`, load branch `permissions` | `loadErrors.authorizations`, branch `authorizations` |
| Guard source `'menu'` / `'permission'` | `'menuCode'` |
| `setPermissions()` | Removed; refresh backend authorizations |

No compatibility aliases or manual code override are provided.

```tsx
<IHasMn value="atlas.sales-administration.menu.451.hasmn-button-example">
  <button>Example</button>
</IHasMn>

<IHasMn value={(source) =>
  source.menuCodes.includes('atlas.sales-administration.menu.451.hasmn-button-example') &&
  source.menuCompanies['atlas.sales-administration.menu.451.hasmn-button-example']?.includes('JKT') === true
}>
  <button>Example for Jakarta</button>
</IHasMn>
```

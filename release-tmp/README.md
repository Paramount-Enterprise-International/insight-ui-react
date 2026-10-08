# React + TypeScript + Vite

## Datepicker formatting

`IDatepicker` and `IFCDatepicker` use `format` for numeric date entry and
parsing. The supported input tokens are `dd`, `MM`, and `yyyy`; their order
and separators can vary, for example `yyyy-MM-dd`.

Set `displayFormat` to show a different format when the input is not focused
or is disabled. For example, `format="dd/MM/yyyy"` with
`displayFormat="dd MMM yyyy"` displays `14 Jul 2026` and switches to
`14/07/2026` for editing. `MMM` and `MMMM` display English month names.
When omitted, `displayFormat` uses `format`. Incomplete or invalid input
remains visible and emits `null`.

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
## Application runtime and API access

Create one runtime in an application-owned module. The factory validates config
and constructs services without issuing network requests.

```ts
import { createIRuntime } from '@insight/ui-react';

export const runtime = createIRuntime({
  api: { identity: 'https://app.example.test/api' },
  signinUrl: 'https://app.example.test/signin',
  appId: 'orders',
});
export const iApiService = runtime.api;

export function loadOrders() {
  return iApiService.get<Order[]>('/orders', { params: { page: 1 } });
}
```

```tsx
<IAuthProvider runtime={runtime}>
  <App />
</IAuthProvider>
```

Components and custom hooks continue to use `useIApi()`; its return value is
exactly `runtime.api`. Auth, session, CSRF, refresh, expiry handling and user-menu
cache belong to that runtime. There is no default runtime or process-wide client
binding. Each remote owns its own runtime.

The existing `<IAuthProvider config={config}>` setup remains supported and creates
an internal runtime. Supply either `runtime` or `config`. Configuration of an
internal runtime is fixed for that provider mount.

### Initialization, logout and cleanup

- `runtime.status` is `idle`, `initializing`, `ready`, or `disposed`;
  `runtime.ready` means initialization settled, including an anonymous restore.
  Authentication is checked separately with `runtime.session.isAuth()`.
- Call `runtime.initialize()` explicitly if needed. The provider and the first
  session API call automatically invoke the same initialization. Concurrent calls
  share one restore, including an already-running session refresh.
- Restore has a 10000 ms limit that aborts its network request. Callback/login
  tokens supersede older restore results. Auth routes and `skipBearer` calls
  bypass session readiness; auth endpoints do not receive a session Bearer token.
- External runtimes survive provider unmount and remount. The application owner
  calls `runtime.dispose()` on final application shutdown. For the config setup,
  final provider unmount disposes the internal runtime after a microtask;
  StrictMode effect replay cancels that cleanup.
- `runtime.session.logout()` immediately clears local session/cache and cancels
  work from the old session, then attempts server logout. Old refresh/restore
  results cannot restore tokens. Session API calls fail until login/callback
  establishes a new token. `skipBearer: true` and auth endpoints remain callable
  after logout and never trigger a refresh retry.
- `dispose()` is idempotent, cancels pending work and clears local services.
  It does not call server logout. API/session/auth/CSRF network calls cannot be
  used after disposal; create another runtime for a new application lifetime.

Access and refresh tokens remain in memory; cookie sessions stay server-owned.
Existing sessionStorage metadata is namespaced by identity host and application
id. Previous global active-session/change-password markers are not imported,
so one application's metadata cannot be restored by another.

### Headers, downloads, uploads and cancellation

JSON results remain transparent; arrays and application envelopes are returned
unchanged. Empty JSON responses (200/204) return `undefined`. Query options accept
a record or URLSearchParams; DELETE payloads remain in `options.body`.

```ts
const response = await iApiService.get('/orders', {
  params: { page: 1, pageSize: 20 },
  responseType: 'response',
});
const total = response.headers.get('X-Total-Count');
const orders = await response.json();

const download = await iApiService.post('/report', { id: 1 }, {
  responseType: 'response',
});
const contentType = download.headers.get('Content-Type');
const disposition = download.headers.get('Content-Disposition');
const file = await download.blob();

const form = new FormData();
form.append('file', selectedFile);
await iApiService.post('/upload', form);

const controller = new AbortController();
await iApiService.get('/orders', { signal: controller.signal, timeoutMs: 60_000 });
```

All verbs support `responseType: 'json' | 'response' | 'blob' | 'arraybuffer' |
'text'`. Raw Response success bodies are not consumed. FormData is sent directly
and Content-Type is removed so the browser supplies the multipart boundary.

The default deadline is 60000 ms for the whole API call, including readiness,
initial transport, shared refresh waiting and one retry. Cancellation of one
caller leaves other refresh waiters active. Parsed binary/text/JSON calls include
body reading in their deadline. Raw Response calls finish at response handoff;
the caller owns subsequent stream reading. Cancellation and timeout errors have
status 0, names AbortError/TimeoutError and codes REQUEST_ABORTED/REQUEST_TIMEOUT;
network failures use NETWORK_ERROR. These cancellations do not show an expiry
dialog. All timers/listeners are released when the call settles.

A 401 triggers at most one refresh and retry. Session-generated Authorization is
replaced with the refreshed token; explicitly provided Authorization is preserved.
CSRF is read again before retry. Retry business errors propagate without expiry.
Refresh failure or a retry still unauthorized uses the runtime's configured
`onUnauthorized`/dialog/redirect flow.

### Backend error display

The canonical backend error contract remains `status` and `message`. Normalization
preserves these fields for callers; formatting changes display text only.

`resolveApiErrorDisplayMessage(error, fallback, catalogResolver?, formatter?)`
supports common backend message and field-validation payloads. Validation
dictionaries in `errors` or `ModelState` display every nonempty message; `model.`
is removed from display field names. Both `message` and `Message` are recognized.
Payload fields and metadata remain available to callers.

Display precedence is application formatter, field validation, backend message,
catalog lookup, detail/title, then local fallback. An empty or failing formatter
uses the default behavior. Configure `errorDisplayFormatter` and
`errorCatalogResolver` on auth config to apply them to library error displays:

```ts
errorDisplayFormatter: (error) =>
  typeof error.description === 'string' ? error.description : undefined,
```

Identity acceptance by business backends, audit username mapping, callback
allowlists, CORS/cookie configuration and cross-origin exposure of pagination and
download headers remain integration responsibilities. Runtimes isolate client
state; server cookies still follow the browser and backend's cookie scoping.

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
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

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
]);
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

| Previous API                                        | Replacement                                                     |
| --------------------------------------------------- | --------------------------------------------------------------- |
| `source.menu`, `source.permission`                  | `source.menuCodes` from authorizations                          |
| `store.permissions`, Angular `permissions$`         | `store.menuCodes`, Angular `menuCodes$`                         |
| `hasPermission()`                                   | `hasMenuCode()`                                                 |
| `hasMenu()`                                         | `hasMenuCode()` for access; `hasNavigableMenu()` for navigation |
| `loadPermissions()`                                 | `loadAuthorizations()` returning authorization DTOs             |
| `loadErrors.permissions`, load branch `permissions` | `loadErrors.authorizations`, branch `authorizations`            |
| Guard source `'menu'` / `'permission'`              | `'menuCode'`                                                    |
| `setPermissions()`                                  | Removed; refresh backend authorizations                         |

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

const download = await iApiService.post(
  '/report',
  { id: 1 },
  {
    responseType: 'response',
  }
);
const contentType = download.headers.get('Content-Type');
const disposition = download.headers.get('Content-Disposition');
const file = await download.blob();

const form = new FormData();
form.append('file', selectedFile);
await iApiService.post('/upload', form);

const controller = new AbortController();
await iApiService.get('/orders', {
  signal: controller.signal,
  timeoutMs: 60_000,
});
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

## Route breadcrumb labels

`IRoute.breadcrumb` accepts a string or `false`. Omit it to use `title`, supply
a string for a separate breadcrumb label, or use `false` to hide that route's
breadcrumb while retaining its page title. Child routes still contribute their
own labels, and their links include the hidden parent's path segments.

```tsx
{
  path: 'customers',
  title: 'Customers',
  children: [{
    index: true,
    title: 'Customer Directory',
    breadcrumb: false,
    element: <CustomerDirectory />,
  }],
}
```

This sends the heading `Customer Directory` and the breadcrumb `Customers`
through the host bridge. If every matched level is hidden, the router sends
`null` for its remote breadcrumb contribution; an Angular host can retain its
host portion. Standalone React uses the same route metadata behavior.

## React host and remote composition

React hosts support the same routing and breadcrumb responsibilities as Angular
hosts. Wrap the host router in HostShell. Use route-level remoteMount to mark
the host/remote boundary and hostBreadcrumbs to provide explicit host ancestry.
These fields are direct IRoute properties in React; Angular uses route data.

The host trail uses nonempty hostBreadcrumbs first, then the longest
segment-aligned menu ancestry, then matched host route labels. IRouter reads
menu changes from the optional auth menu store, or from its menus prop.
Remote route labels append after that trail. Heading priority is an explicit
title override, remote title, then the deepest route title.

| Capability                                   | Angular                          | React                              |
| -------------------------------------------- | -------------------------------- | ---------------------------------- |
| Hide a breadcrumb without hiding its heading | data.breadcrumb: false           | breadcrumb: false                  |
| Host/remote boundary                         | data.remoteMount                 | remoteMount                        |
| Explicit host ancestry                       | data.hostBreadcrumbs             | hostBreadcrumbs                    |
| Reactive menu fallback                       | IUserMenuStore.menus$            | Auth menu store or IRouter menus   |
| Remote-only metadata                         | IHTitleBreadcrumbService setters | useHostUi setters or remote bridge |
| Full overrides                               | setTitle / setBreadcrumbs        | setTitle / setBreadcrumbs          |
| Clear only remote contribution               | clearRemote()                    | clearRemote()                      |
| Restore route defaults and clear overrides   | clear()                          | useHostUi().clear()                |

Both UI state APIs provide setRemoteTitle(), setRemoteBreadcrumbs() and
clearRemote(). Calling clearRemote() preserves host routes and full overrides.
Passing null to a full override restores defaults; setBreadcrumbs([]) explicitly
renders the Home placeholder without the normal trail.

For a remote with its own descendant IRouter, create one bridge at the active
mount. Existing remote setTitle/setBreadcrumbs calls then update only the remote
contribution. The router publishes permission denial through a separate metadata
channel so the entire displayed trail can become Unauthorized Access.

```tsx
import {
  HostShell,
  IRouter,
  IHostApiProvider,
  useRemoteHostApi,
} from '@insight/ui-react';

function CustomerRemote() {
  const hostApi = useRemoteHostApi();
  return (
    <IHostApiProvider hostApi={hostApi}>
      <IRouter routes={customerRoutes} />
    </IHostApiProvider>
  );
}

const hostRoutes = [
  {
    path: 'sales/customer/*',
    title: 'Customer',
    remoteMount: true,
    hostBreadcrumbs: [
      { label: 'Sales' },
      { label: 'Customer', url: '/sales/customer' },
    ],
    element: <CustomerRemote />,
  },
];

// Place under BrowserRouter, with its actual basename.
<HostShell>
  <IRouter routes={hostRoutes} />
</HostShell>;
```

Use one active remote bridge per HostShell. It clears remote state on unmount
and ignores subsequent metadata callbacks from that unmounted bridge. Do not
remount HostShell for individual pages. Bridge navigation accepts host URLs;
a federation adapter still owns module loading and translation of a remote's
business navigation URLs when needed.

HostShell retains full setTitle/setBreadcrumbs overrides. The built-in router
uses setRouteMetadata so ordinary navigation cannot overwrite those overrides.
The added IHostApi methods are optional for compatibility with existing custom
bridges; bridges without setRouteMetadata retain the previous complete-metadata
callbacks.

Breadcrumb URLs support text-only groups, resolved parameters and the router
basename without double-prefixing. Link hrefs preserve query strings and
fragments, and modified clicks use native browser behavior. The last level stays
non-clickable.

## Controlled notifications

```tsx
<IHContent notification={notificationState} onNotificationAction={handleNotificationAction} />
// IHContentLayout also forwards these props.
// Outside IHContent, for example a profile header:
<INotification state={notificationState} onAction={handleNotificationAction} />
```

`notification` is optional. Omit it or pass `null` to hide the bell and clean up
its overlay. `{ unreadCount: 0 }` shows the bell without a badge. The header places
it after the title at the far right. Supply it only on the owning shell; remote
pages should not render a second notification instance.

`INotificationState` requires only `unreadCount`. Optional fields are `open`,
`items`, `loading`, `hasLoaded`, `loadingMore`, `readingId`, `hasMore`, `error`,
`loadMoreError`, `actionError`, and `snackbar`. Lists default to empty, flags to
false, and errors/snackbar to null. Set `hasLoaded` after the first successful
list response, including an empty response, to distinguish refresh from initial
loading. Replace state references when updating data.

`INotificationAction` is a discriminated union using `type`: `toggle`, `close`,
`open-all`, `open-item` (with `item`), `load-more`, `retry`, `retry-read`, and
`dismiss-snackbar`. The consumer updates controlled `open` state in response to
toggle/close. Opening a snackbar item emits `open-item` as well.

`INotificationEntry` retains notification/module ids, module name, title,
description, nullable link, `isDismissable`, group count, latest date, and optional
visual metadata. `INotificationSnackbarMessage` contains key/title, optional
module name and item. The separate bell, drawer, item, snackbar components and
presentation helpers are also exported.

Load the matching `insight-ui-css` stylesheet, which owns all notification layout
and visuals. The drawer provides modal focus, backdrop, Escape, scroll locking,
and focus restoration. Refresh keeps list entries mounted and interactive;
load-more requests occur at 80% scroll and are suppressed while busy or failed.
The library emits events only: API, session, SSE, routing, read operations, resolved
error messages, snackbar duration and deduplication remain consumer-owned.

Notification overlays reuse `IDialogContainer` through a body portal, with focus
and scroll management matching Angular. Higher Insight dialogs retain focus and
Escape priority over an open notification drawer.

## Resizable sidebar

`IHSidebar` enables pointer and keyboard resizing by default. Load the matching
`insight-ui-css` stylesheet before mounting the sidebar; it owns the resize handle
and interaction styles. The initial width comes from `--i-sidebar-width` (260px
by default), unless a valid saved preference exists. Width overrides stay on the
sidebar instance and do not change the root CSS token.
The initial width is applied without animation, including after a tab refresh;
the visibility toggle retains its transition.

| Prop | Default | Contract |
| --- | --- | --- |
| `resizable` | `true` | Enable the right-edge resize handle. |
| `minWidth` | `220` | Minimum width in pixels. |
| `maxWidth` | `480` | Maximum width in pixels. |
| `widthStorageKey` | `'insight.sidebar.width'` | localStorage key; `null` disables persistence. |
| `onWidthChange` | Optional callback | Receive the final width in pixels after a changed pointer or keyboard interaction. |

```tsx
<IHSidebar
  user={user}
  menus={menus}
  visible={sidebarVisible}
  minWidth={220}
  maxWidth={480}
  widthStorageKey="my-app.sidebar.width"
  onWidthChange={onSidebarWidthChange}
/>
```

Drag the right edge with a mouse, pen or touch. Width snaps to the initial CSS
default within 12px and moves freely outside that distance. Snapping applies
only when the default is inside the configured bounds. The bounds stay fixed
on narrow screens; the existing visibility toggle remains available.

Focus the separator and use Left/Right arrows for 10px steps, Shift+arrows for
50px steps, Home for minimum and End for maximum. Keyboard steps do not snap.
Escape, pointer cancellation, lost capture, window blur, hide, disable or unmount
cancel an active drag and restore its starting width without emitting or saving.
Hiding and showing the sidebar preserves a completed width change.

Preferences use a numeric string in localStorage, shared per browser origin
across Angular and React. Use a custom key to isolate applications or instances;
there is no account scoping or live cross-tab synchronization. Reads ignore
invalid values and clamp valid values to the configured bounds. Writes occur
only after completed width changes; blocked or full storage leaves resizing
available in memory. Changing the key reloads that preference or the CSS default.

An initially disabled sidebar keeps its CSS width and ignores saved preferences
until enabled. Disabling an already initialized sidebar retains its last width.
Changing bounds clamps the current width without emitting or saving. Bounds must
be positive finite numbers; invalid values fall back to 220/480, and a maximum
below the minimum is raised to the minimum.

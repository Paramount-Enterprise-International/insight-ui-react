# React + TypeScript + Vite

## Host shared state

`IHStateOwner` is created once by the host. Namespaces use `session` by default;
`temporary` survives navigation until refresh, and `local` explicitly uses
persistent browser storage. Additional adapters implement synchronous `getItem`,
`setItem`, and `removeItem`; register them in the owner constructor.

Register namespace configuration before first use; conflicting storage settings
throw. State values are detached, frozen JSON-compatible snapshots. Update through
the API instead of mutating returned objects. `get` fallbacks are not persisted.
Read/write/remove failures are exposed by `getError(namespace)` without changing
storage. No asynchronous adapters or live cross-tab broadcasting are included.

Scope the owner prefix to the application, synchronize `setIdentity` after session
restoration, and clear it with `setIdentity(null)` on logout. The identity must
include the subject and impersonation context, and stay stable during token refresh.
Identity changes discard the previous and replacement contexts. Hosted remotes
reuse the owner; standalone selectors do not create a persistent owner implicitly.

The host passes the owner as `hostApi.state`. Every mount/breadcrumb/remote
bridge must preserve this property. A React host may pass it to
`<HostShell state={owner}>`; a hosted remote must never create another owner.

```tsx
const { value, set, update, reset, error } = useIHState('shared.filters', 'count', 0);
// update(count => count + 1); reset() removes the key, restoring the fallback.
const { controller, value: selection } = useIHSelection();
```

The hook handles subscription cleanup and requires a host bridge. The underlying
API also provides `registerNamespace`, `get`, `set`, `update`, `remove`,
`clearNamespace`, `getError`, and `subscribe`.

Hosted company selectors automatically use the shared company/project context.
Initial consumer values do not replace host candidates. Add `stateScope="local"`
for independent record fields. Company options are scoped to the active menu;
missing mapping/loading does not expand access to all companies. A successful
validation that excludes the company resets both company and project. Pages
without selectors retain candidates. Restore/reset synchronizes value-change
callbacks; `onOptionSelected` remains user-only.

`selection` stores only company ID/project key in the reserved `shared.selection`
session namespace. Use `setCompany`/`setProject` for changes. On company/menu
changes, call `beginProjects`, load authoritative options in the remote, and call
`resolveProjects(token, canonicalKeys)` or `rejectProjects(token, message)`.
Check the returned boolean before accepting rows; stale responses are rejected.
Cancel page-owned requests or ignore their results on cleanup. Candidate project
keys survive a company change if still available. Do not validate absence using
only a search result page. Require both selected IDs and ready statuses before
business requests.

`loading` is supported by selects and form-control variants and combines with
`options$` loading. Company selectors derive authorization loading automatically;
remote-owned project selects receive explicit loading/disabled states.

See the [platform integration guide](../docs-sso-web/public/docs/sso/iam-sso-integration-guide_v2.md#ihstate-shared-state-and-companyproject-selection)
and both atlas-remote Host Integration examples. New exports require an updated
library dependency before consumer compilation; no version is implied by this source change.

## Company selects

`ISelectCompany` and `IFCSelectCompany` read company options reactively from the
current `IUserMenuStore` through `useIUserMenuStore()`. Render them under
`IAuthProvider` (or the runtime's provider) and load the store at application level;
the components never fetch data themselves. See
[authorization data](#authorization-codes-and-navigation) for the store's company scope contract.

```tsx
import { useState } from 'react';
import {
  IFCSelectCompany,
  ISelectCompany,
  type IMenuCompanyDto,
} from '@insight/ui-react';

export function CompanyFilter() {
  const [company, setCompany] = useState<IMenuCompanyDto | null>(null);
  return (
    <>
      <ISelectCompany
        value={company}
        onChange={({ value }) => setCompany(value)}
      />
      <ISelectCompany
        menuCode="sales"
        value={company}
        onChange={({ value }) => setCompany(value)}
      />
      <IFCSelectCompany
        label="Company"
        menuCode="sales"
        value={company}
        onChange={({ value }) => setCompany(value)}
        errors={company ? null : { required: true }}
        touched
      />
    </>
  );
}
```

In local mode, omitting `menuCode`, or passing a blank value, shows all `store.companies`.
A nonblank code is trimmed and restricts options through
`store.menuCompanies[menuCode]`. An unknown menu shows no options. Store ordering
and deduplication are preserved.

Values are company objects (`id`, `code`, `name`) or `null`. Both components support
controlled `value` and uncontrolled `defaultValue`. Labels default to `name`;
search matches `name` and `code` without case sensitivity. `displayWith`,
`filterPredicate`, option renderers, dropdown settings, `invalid`, `disabled`,
and refs with `ISelectHandle.focus()` follow the regular select. Exported prop
types are `ISelectCompanyProps` and `IFCSelectCompanyProps`; options are store-owned,
so neither accepts `options` or `options$`.

Selection invokes `onChange`, `onChanged`, and `onOptionSelected` with
`ISelectChange<IMenuCompanyDto>`. No company is selected automatically. In local mode, refresh
matches a selected option by `id` without emitting events or replacing the
consumer's value. In local mode, if a menu change, refresh, or reset removes the selected company
from the options, its value remains until the consumer resets it.

`IFCSelectCompany` adds `label`, `errors`, `errorMessage`, `submitted`, `touched`,
and `dirty` with the same validation timing as `IFCSelect`: when `submitted` is
provided it controls error visibility; otherwise touched or dirty enables errors.
Load matching Insight CSS for the `i-select-company` and `i-fc-select-company` hosts,
which share the regular select styles.

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

## Session and access route preservation

`IRequireAccess` and `IRequireRouteAccess` display the existing Insight forbidden
page at the requested URL, including its query and fragment. Denied content does
not mount. The host receives denial metadata, which is cleared when the denial
unmounts. Their legacy `unauthorizedPath` prop is deprecated and ignored; the
`UNAUTHORIZED_ACCESS_PATH` export remains available for explicit application routes.

Session expiry uses the application-level `ISessionExpiredDialog` by default.
Mount that dialog outside `IRequireAuth` and access guards: protected content is
hidden while the overlay owns recovery, and guards do not start access loading
beneath it. API 403 responses remain available to their owning page without
clearing the session or navigating. A first visit without a session may still
redirect to sign-in automatically. Explicit `onUnauthorized` and legacy
`unauthorizedHandling: 'redirect'` configuration keep their existing behavior.

Session restore, API expiry, failed impersonation-session termination and the
auth guard retain the full browser destination for relogin. Ordinary query and
fragment values survive; `at` handoff fields are removed from the fragment before
building the sign-in return URL. The helper does not alter the visible page URL.

`IAuthCallback` normalizes captured browser paths against the actual React Router
basename before calling `navigate`, preventing duplicate mount prefixes. Trusted
same-origin absolute destinations use router navigation; existing external-origin
allowlists still apply. The callback consumes a handoff once under StrictMode.
A callback without a token can continue an authenticated cookie session; without
a session it shows the recovery dialog at the callback URL and retains the
intended destination until the user chooses to log in again.

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

Toggling slides the drawer from the right over 240ms and fades its backdrop.
Closing retains the modal and scroll lock until the exit finishes; reopening
reverses the transition. Reduced-motion preferences disable animation. Removing
state or unmounting the component cleans up immediately.

## Resizable sidebar

When resizing is enabled, a 4px lane inside the sidebar separates the resize
handle from the menu scrollbar. The total sidebar width stays unchanged; only
the menu body reserves this space. Disabling resizing removes the lane.

Pointer resizing updates the sidebar and content live, at most once per
animation frame, without triggering React renders on pointer movement.
Menu indentation stays fixed while long labels truncate with an ellipsis.

`IHSidebar` enables pointer and keyboard resizing by default. Load the matching
`insight-ui-css` stylesheet before mounting the sidebar; it owns the resize handle
and interaction styles. The initial width comes from `--i-sidebar-width` (260px
by default), unless a valid saved preference exists. Width overrides stay on the
sidebar instance and do not change the root CSS token.
The initial width is applied without animation, including after a tab refresh;
the visibility toggle retains its transition.

| Prop              | Default                   | Contract                                                                           |
| ----------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| `resizable`       | `true`                    | Enable the right-edge resize handle.                                               |
| `minWidth`        | `220`                     | Minimum width in pixels.                                                           |
| `maxWidth`        | `480`                     | Maximum width in pixels.                                                           |
| `widthStorageKey` | `'insight.sidebar.width'` | localStorage key; `null` disables persistence.                                     |
| `onWidthChange`   | Optional callback         | Receive the final width in pixels after a changed pointer or keyboard interaction. |

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

## Sidebar menu state

`IHSidebar` persists explicit expand/collapse choices only for top-level headers,
including legacy modules and Favorites, in localStorage per browser origin.
The `menuStateStorageKey` prop defaults to `'insight.sidebar.menu-state'`;
use a custom key to isolate consumers or `null` to keep choices in memory only.
This does not enable `collapsible`.

```tsx
<IHSidebar
  user={user}
  menus={menus}
  collapsible
  menuStateStorageKey="my-app.sidebar.menu-state"
/>
```

Choices are keyed by modern `id` or legacy `menuId`; Favorites has its own
namespace. ID-less groups work in memory but do not persist across mounts.
In collapsible mode, nested containers start collapsed on each mount, even when
their payload or an older stored preference marks them expanded. Their manual
choices remain in memory across navigation, replacement arrays and temporary empty
emissions, and reset on remount. Root headers retain their existing default
visibility unless a saved or manual choice overrides it. Nesting is determined
from the tree, independently of payload `level` values.
The version 1 storage format is unchanged; old nested entries are ignored and
the next toggle saves only preferences for known top-level headers from both
the main and Favorites sections.
Versioned storage ignores invalid entries and missing IDs. Blocked/full storage
does not prevent menu interaction. Changing the storage key loads its preferences;
temporary empty emissions and replacement menu arrays do not erase choices.
Consumer menu objects are not mutated.

Once initial routing has completed and menus are available, the sidebar opens
the ancestors of the current internal menu and positions that row 16px below the
top of the sidebar scroll area, including when it is already visible. The offset
is limited by the container's minimum and maximum scroll positions.
Exact routes and the longest segment-aligned prefix support detail URLs; query,
fragment and router base path do not change the match. The main tree takes
priority over a duplicate favorite, with Favorites as a fallback. Unmatched
routes do not scroll. Scrolling affects only the sidebar container, without
animation or keyboard focus changes.
If Favorites arrives first, a later main-tree match takes priority while initial
restoration is still undisturbed by user toggles or page navigation.

Restoration runs once per mount. Automatic ancestor expansion does not overwrite
saved choices, and users may collapse those groups again until the next refresh.
Subsequent page navigation cancels any pending restoration. Hidden sidebars and
search filters that hide the target defer scrolling until it is visible; search
text and URL filters remain intact. Temporary search expansion is not persisted.
Search opens every ancestor of a match, including collapsed legacy modules.
Matching a container displays and opens its entire descendant branch. Search
results can then be collapsed or expanded without changing normal menu choices
or localStorage. These temporary choices survive menu hydration for the same
trimmed term and reset when the applied term changes. Clearing
the search restores the previous expansion state. Flat mode
(`collapsible=false`) continues to display every level.

Search input updates immediately. Filtering, highlighting, and the `menu-filter`
URL parameter update together after 200 ms without further input; initial URL
filters apply immediately. URL updates replace the history entry and preserve
other query parameters and the fragment. Page navigation and unmount cancel
pending search work. Arrow keys and Enter flush a pending filter before acting;
Enter still requires an explicitly selected result. Keyboard navigation skips
leaves inside collapsed search groups. Favorites retain their existing behavior.

### Active route highlighting

The current internal leaf menu has `is-active` and `aria-current="page"`.
Highlighting follows completed navigation, redirects and browser history, and
updates when menus or Favorites arrive. It is independent of keyboard search
selection (`is-selected`), expansion preferences and one-time scroll restoration.
Navigation updates the highlight without automatically reopening groups.

Matching uses the full menu tree before search filtering. Exact paths and the
longest segment-aligned prefix support detail URLs; query, fragment, trailing
slash and router base path do not change the match. The root route matches only
the root. Equal matches use the first menu in tree order. Absolute URLs,
protocol-relative URLs and query-only or fragment-only links are excluded.
The main tree takes priority, with Favorites as a fallback. Copies with the same
`id` (or legacy `menuId`) are highlighted in both sections. Unmatched routes clear
the highlight; filtering cannot transfer it to another menu.

Load the matching `insight-ui-css` stylesheet for the gray active background,
darker left accent, label and icon colors, semibold label and stronger hover
backgrounds. Favorite star colors and actions keep their existing styles. No
additional sidebar properties or menu contract fields are required.

## Shared presentation components

The React package exports `IActionPlaceholder`, `IBanner`, `IEmptyState`,
`IHighlightSearch`, `ILoadError`, `ILoadingRegion`, and `IImageCropper`.
Load the matching insight-ui-css build; these components share its tokens and surface rules.

- `IButton.placeholder` defaults to false. When true, it renders only an inert,
  decorative placeholder using the button's current `size`. No button/link, icon,
  spinner, children, submit/reset, or navigation is rendered. `IActionPlaceholder`
  is also available independently; its default size matches IButton (`md`).
- `IBanner` accepts `message` and projected content/children, plus `prefixIcon`
  and `suffixIcon`. Content renders after the message. Variants are `neutral`,
  `primary`, `success`, `info` (default), `warning`, and `danger`.
  Neutral is unaccented gray. Primary follows --i-color-primary; info follows
  --i-color-info (cyan in the default theme). Messages are text;
  rich content is supplied as framework children, never an HTML string.
- `closable` defaults to false. Without `open`, banner state starts at
  `defaultOpen` (true) and Close immediately dismisses it. With `open`, visibility
  is controlled by the parent. Angular exposes `openChange` for `[(open)]`;
  React exposes `onOpenChange`. Both expose `onClose` and `closeLabel` (default
  `Close`). Changing content does not reopen a dismissed instance.
- `IEmptyState` supports `empty`, `search`, `filter`, `search-filter`, and
  `prerequisite`, with title/description/icon overrides, density, and children/CTA.
- `IGrid.emptyState` configures the built-in empty state. Angular provides an
  `ng-template iGridEmptyDef` slot; React provides `renderEmptyState`. The slot
  receives the resolved config. Keep business prerequisites outside the grid.
  Initial empty data hides grid chrome. Search/filter no-result keeps headers
  and pagination, reserving pageSize times `--i-grid-empty-row-height`
  (default `--i-size-md`) inside the scrolling viewport. Tree/non-paginated
  empty states use the shared default state height. Keep the grid mounted when search returns no rows.
  `IGridDataSource.filteredLength` exposes the total before local pagination;
  `length` retains its existing raw/server meaning. Server-owned search state
  and copy must follow the successful response that populated the displayed rows.
- `IHighlightSearch` accepts `value` (string/number/null/undefined) and `search`.
  It renders plain text and highlights literal, case-insensitive matches. The
  Angular `IHighlightSearchPipe` remains available with its existing contract.
- `ILoadError` accepts message/title, `density` (`default`, `compact`, `inline`),
  retryDisabled/retryLoading, and `onRetry`. The application owns recovery requests.
- `ILoadingRegion` retains DOM and measured height during refresh, sets aria-busy,
  and blocks content with inert. Its inputs/props include loading, error, label,
  contextKey, initialMinHeight, height, containerClass, contentClass, and layout.
  Angular exposes `hasLoaded`; React also accepts children as `({hasLoaded}) => ...`.
  Owners retain data and reject stale responses when context changes.
- `IImageCropper` supplies zoom/pan and keyboard repositioning without a dialog,
  picker, or upload. Inputs/props include src, disabled, viewportSize (240), shape
  (`square`/`circle`), minZoom (1), maxZoom (3), alt, zoomLabel, and panLabel.
  `onReady`/`onError` report image state. Angular component references and the React
  `IImageCropperHandle` ref expose `exportImage({mimeType, quality})`, returning
  a Promise with blob/dataUrl/mimeType/width/height. Exports preserve source crop
  resolution without upscaling; circle is a preview mask and output stays square.
  Source changes/destruction invalidate pending exports. Remote images must permit
  canvas export; export failures reject the Promise. File limits remain app-owned.

### Grid column minimum width

`IGridColumn` and `IGridCustomColumn` accept an optional numeric `minWidth` in
pixels, including inside column groups. It applies to the initial layout and
drag resizing, keeping header and body cells aligned. A numeric or resized width
below the minimum is clamped, and frozen offsets use the clamped width.

```tsx
<IGridColumn fieldName="name" title="Name" width="fill" minWidth={120} />
<IGridCustomColumn title="Actions" width={45} />
```

Without `minWidth`, only `width="fill"` gets a default minimum of **150px**,
including auto-generated columns. Fill columns keep sharing available space;
the viewport scrolls horizontally when the columns no longer fit. Numeric and
omitted widths have no default minimum, so a 45px action column stays 45px and
can resize below 50px. The initial width when `width` is omitted remains 200px.
An explicit minimum overrides the fill default and may be below 150px.
Changing `minWidth` also constrains an existing resized width. Keep React column
keys and the declared `width` stable to preserve resized widths across renders.

### Automatic surface layout

Section body and loading region default to `layout="auto"`, with `padded` and
`flush` overrides. Section owns padding and corner radii. A sole child marked
`data-i-surface="delegate"` receives the padding responsibility; a sole `flush`
child takes the full area. Loading regions delegate and grids are flush.
Nested wrappers consume padding once. Content, grid, and overlays share per-corner
surface radii, while form focus rings and dropdowns retain their normal overflow.
App wrappers can implement the same marker contract or use an explicit override.

The shared --i-state-min-height token defaults to min(40vh, 240px).
Initial loading and default-density empty presentations reserve the same height.
An explicit initialMinHeight on a loading region also applies to its empty content.
Padding is counted once, including standalone prerequisites inside a region.
Compact empty states retain natural height. Paginated search/filter no-result still
uses pageSize times the nominal row height; bounded grids can shrink to their viewport.
Content larger than the baseline can expand normally.

### Migration from local IAM components

Use the exported components instead of the removed IAM presentation wrappers.
Replace `iam-error-banner` with `i-banner variant="danger"`; map icon to prefixIcon.
Replace `iam-load-error` retry bindings with `onRetry`. Remove `seamlessGrid` and
IAM-specific surface CSS when switching to ILoadingRegion.

**Breaking removal:** `IInfoNotice`, `IInfoNoticeProps`, `i-info-notice`, and its
CSS tokens have been removed. Use IBanner with variant info and prefixIcon info.
Preserve a notice title as a strong element in projected content/children.
The session-specific IHImpersonationBanner API remains available.

Component playground pages are independent:

- `/demos/action-placeholder`: Action Placeholder.
- `/demos/banner`: Banner.
- `/demos/empty-state`: Empty State.
- `/demos/highlight-search`: Highlight Search.
- `/demos/load-error`: Load Error.
- `/demos/loading-region`: Loading Region.
- `/demos/image-cropper`: Image Cropper.

The former `/demos/shared-ui` route redirects to `/demos/action-placeholder`.
These library playground routes require no IAM menu or access code.

**Banner rename:** use `neutral` instead of the former `default` variant.
Omitting variant still selects info.

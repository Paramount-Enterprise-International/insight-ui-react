# Error page

`IErrorPage` is exported by `@insight/ui` in Angular and React. Its styles are supplied by the latest `insight-ui-css` bundle.

## Presets and layout

- `kind`: `not-found` (default), `unauthorized`, `forbidden`, `server-error`, `service-unavailable`, `application-access-denied`, or `custom`.
- `mode`: `contained` (default) renders an Insight section and body; `fullpage` fills the viewport without a section.
- `title`, `description`, `icon`, and `code`: optional independent overrides. Omit to use preset content; pass an empty string to hide the corresponding element.
- `supportEmail`: defaults to `it.helpdesk@paramountenterprise.co.id`. Pass an empty string to hide assistance.
- `actions`: optional array of `home`, `logout`, and `retry`. Defaults to no buttons. The component emits `onAction`; the consumer owns navigation, logout, and retry behavior.

Preset titles and descriptions are in English. Application access denial omits the numeric code. The component does not inspect API errors or decide authorization.

## Angular

Import `IErrorPage` as a standalone component, or use the `IUI` module.

```html
<i-error-page kind="not-found" [actions]="['home']" (onAction)="handleAction($event)" />

<i-error-page kind="application-access-denied" mode="fullpage">
  <p class="m-0">Additional instructions from the application.</p>
  <i-button iErrorPageActions variant="danger" [routerLink]="['/logout']">Logout</i-button>
</i-error-page>
```

Unselected content is projected below the description. Elements marked `iErrorPageActions` are projected into the actions row.

## React

```tsx
<IErrorPage
  kind="not-found"
  actions={['home']}
  onAction={() => { void navigate('/'); }}
/>

<IErrorPage
  kind="application-access-denied"
  mode="fullpage"
  customActions={<IButton onClick={logout} variant="danger">Logout</IButton>}
>
  <p className="m-0">Additional instructions from the application.</p>
</IErrorPage>
```

`children` supplies additional content; `customActions` supplies the actions slot. Standard HTML host attributes such as `role`, `className`, and `style` are supported.

## Styling

Shared `.i-error-page` styles use Insight tokens and responsive wrapping. Consumers can set `--i-error-page-min-height`, `--i-error-page-content-width`, `--i-error-page-code-size`, `--i-error-page-icon-color`, and `--i-error-page-code-color` on the component host. Contained expands within the available parent height, with a minimum body height of `60vh`; fullpage uses a minimum viewport height. The content width defaults to `30rem`, with a regular 32px heading and compact 14px message lines. Icons and codes are gray, except for the blue `not-found` preset.

## Consumer integration

Page-level 404/401/403 views and permission-boundary denial content use this component. Loading, authorization decisions, URL recognition, title/breadcrumb ownership, and error normalization remain in the consumer or existing boundary. Form-error banners and session-expired dialogs are separate components.

The Atlas React documentation demo is available at `/docs/error-page`, under its existing docs permission. Consumer integrations assume the newest UI and CSS versions are available; existing dependency and CDN pins are intentionally unchanged.

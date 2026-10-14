# insight-ui-react: routing and breadcrumb handoff

This handoff records the local branch comparison performed on 2026-10-14.
It includes committed feature-branch changes **and uncommitted working-tree
changes** relative to the baseline below. Local branch references were used;
remote branches were not fetched. Subsequent edits are outside this snapshot.

Baseline: local `release` at `62c8c02`.

## Shared routing contract

The host owns public URLs and host breadcrumb ancestry. Remotes supply selected
route collections and their own breadcrumb levels.

```json
{
  "path": "sales",
  "title": "Sales",
  "children": [
    {
      "path": "customer",
      "title": "Customer",
      "remoteName": "atlas-angular",
      "routeName": "docsRoutes"
    }
  ]
}
```

```text
Public URL:   /-/sales/customer
Remote entry: /apps/atlas-angular/remoteEntry.json
Collection:   docsRoutes
Breadcrumb:   Sales > Customer > remote route labels
```

`children` supports further nesting. Paths are relative to parents. A node
must declare a remote or nonempty children. Configured host titles override
menu-derived ancestry; registrations without host titles retain the menu
fallback. A group without a remote has no landing page.

The host assigns the runtime federation alias using `remoteName`; it may
differ from the remote's fixed build name. Each remote must be deployed at
`/apps/{remoteName}/remoteEntry.json`. The defaults for omitted `routeName`
are `routes` for Angular and `contentRoutes` for React.

## Changes from release

- `src/components/host/router.types.ts`: `IRoute.breadcrumb` now accepts
  `string | false`.
- `src/components/host/router.tsx`: explicitly skips breadcrumb-suppressed
  levels while processing the matched route chain.
- Added `src/components/host/router.test.tsx` and README guidance.

## Behavior

- Omitted `breadcrumb` uses the route's title.
- A string supplies a separate label.
- `breadcrumb: false` hides that breadcrumb level, while retaining its page
  title and consumed URL segments.
- Descendants still contribute labels and correctly resolved links.
- If all matched levels are hidden, the existing bridge receives a null trail;
  the Angular host can retain its host breadcrumb portion.

## Contributor actions

1. Publish the library changes and update React consumers.
2. Use the updated release when declaring `breadcrumb: false` in TypeScript.
3. Verify heading independence, child trails, and permission-error metadata.

## Compatibility

This is additive. Existing string labels and omitted breadcrumb fields remain
supported. React's host bridge and standalone rendering architecture are not
replaced. The host-side composition is implemented in the Angular UI library.

## Verification and rollout

Relevant tests and builds passed during implementation. The branch-comparison
audit did not rerun all checks. Recorded checks include host routing tests,
local template-generation tests, shared Angular breadcrumb integration tests,
both remote unit suites/builds, and React UI suppression/permission tests,
typecheck, lint, and library build.

Nothing was deployed as part of this work. After publishing dependencies and
updating ConfigMaps, verify authenticated deep links, selected collections,
mount switching, back/forward navigation, breadcrumb links, standalone mode,
unknown routes, and denied-page behavior with the deployed host and remotes.

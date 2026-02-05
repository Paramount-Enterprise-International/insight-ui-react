/* App.tsx */
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './App.css';

import { IDialogOutlet, IDialogProvider } from './components';
import { Create } from './demos/heracles/create/Create';
import { Docs1Page } from './docs/docs1/docs1';
import { Docs2Page } from './docs/docs2/docs2';
import { IHRootLayout } from './ih-root-layout';

function NotFoundPage() {
  return (
    <div className="p-md">
      <h1 className="mb-md">Not Found</h1>
      <p className="text-subtle">
        The page you are looking for doesn&apos;t exist.
      </p>
    </div>
  );
}

/**
 * IMPORTANT:
 * - `handle: { title }` is what IHContent reads for breadcrumbs via useMatches().
 * - If you don't want breadcrumbs yet, you can omit handle.
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Layout wrapper (like Angular ih-root) */}
      <Route element={<IHRootLayout />}>
        <Route index element={<Navigate to="/demos/grid" replace />} />

        <Route
          path="docs/docs1"
          element={<Docs1Page />}
          handle={{ title: 'Docs 1' }}
        />
        <Route
          path="docs/docs2"
          element={<Docs2Page />}
          handle={{ title: 'Docs 2' }}
        />

        <Route
          path="demos/heracles/create"
          element={<Create />}
          handle={{ title: 'Create' }}
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<NotFoundPage />}
        handle={{ title: 'Not Found' }}
      />
    </>
  )
);

export default function App() {
  return (
    <IDialogProvider>
      <RouterProvider router={router} />;
      <IDialogOutlet />
    </IDialogProvider>
  );
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { GridTree } from './demos/grid-tree/grid-tree';
import { Grid } from './demos/grid/grid';
import { Docs1Page } from './docs/docs1/docs1';
import { Docs2Page } from './docs/docs2/docs2';

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/demos/grid" replace />} />

        {/* Docs routes */}
        <Route path="/docs/docs1" element={<Docs1Page />} />
        <Route path="/docs/docs2" element={<Docs2Page />} />

        {/* Playground routes */}
        <Route path="/demos/grid" element={<Grid />} />
        <Route path="/demos/grid-tree" element={<GridTree />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

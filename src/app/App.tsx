import { RouterProvider } from 'react-router';

import { DependenciesProvider } from './providers/DependenciesProvider';
import { router } from './router';

export function App() {
  return (
    <DependenciesProvider>
      <RouterProvider router={router} />
    </DependenciesProvider>
  );
}

import { createBrowserRouter } from 'react-router';

import { RatingFlow } from '@/app/flows/RatingFlow';
import { DuelPage, EveningPage, HistoryPage, HomePage, NotFoundPage } from '@/ui/pages/stubs';
import { WelcomePage } from '@/ui/pages/WelcomePage/WelcomePage';

/** Адреса совпадают с картой экранов в плане. Вложенные шаги режимов появятся внутри своих веток. */
export const router = createBrowserRouter([
  { path: '/', element: <WelcomePage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/evening/*', element: <EveningPage /> },
  { path: '/duel/*', element: <DuelPage /> },
  { path: '/rating/*', element: <RatingFlow /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

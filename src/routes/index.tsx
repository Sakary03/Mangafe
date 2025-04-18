import { RouteObject } from 'react-router-dom';
import HomePage from '../components/common/HomePage';
import Login from '../pages/auth/Login';
import NotFoundPage from '../pages/common/NotFoundPage';
import UserLayout from '../layouts/UserLayout';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import MangaList from '../pages/dashboard/Manga/MangaList';
import Dashboard from '../pages/dashboard/DashBoard';
import MangaChapterList from '../pages/dashboard/MangaChapter/MangaChapterList';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '/auth/login',
        element: <Login />,
      },
      {
        path: '',
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/dashboard/manga',
    element: <MangaList />,
  },
  {
    path: '/dashboard/manga/:mangaId/chapters',
    element: <MangaChapterList />,
  },
  {
    path: '/dashboard/',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;

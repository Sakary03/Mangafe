import { RouteObject } from 'react-router-dom';
import HomePage from '../components/common/HomePage';
import Login from '../pages/auth/Login';
import NotFoundPage from '../pages/common/NotFoundPage';
import UserLayout from '../layouts/UserLayout';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import MangaList from '../pages/dashboard/Manga/MangaList';
import Dashboard from '../pages/dashboard/DashBoard';
import MangaChapterList from '../pages/dashboard/MangaChapter/MangaChapterList';
import Register from '../pages/auth/Register';
import UserProfile from '../pages/common/UserProfile';
import ChapterList from '../pages/dashboard/Chapter/ChapterList';
import UserList from '../pages/dashboard/User/UserList';
import Home from '../components/common/HomePage/Home';
import MangaDetailPage from '../components/common/ViewManga.tsx/MangaDetailPage';
import MangaChapterReader from '../components/common/ViewChapter/MangaChapterReader';

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
        path: '/auth/register',
        element: <Register />,
      },
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: '/manga/:mangaId',
        element: <MangaDetailPage />,
      },
    ],
  },
  {
    path: '/manga/:mangaId/chapter/:chapterIndex',
    element: <MangaChapterReader />,
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
    path: '/dashboard/chapters',
    element: <ChapterList />,
  },
  {
    path: '/dashboard/users',
    element: <UserList />,
  },
  {
    path: '/dashboard/',
    element: <Dashboard />,
  },
  {
    path: '/common/profile',
    element: <UserProfile />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;

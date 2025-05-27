import { RouteObject } from 'react-router-dom';
import HomePage from '../components/common/HomePage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFoundPage from '../pages/common/NotFoundPage';
import UserProfile from '../pages/common/UserProfile';
import UserLayout from '../layouts/UserLayout';
import Dashboard from '../pages/dashboard/DashBoard';
import MangaList from '../pages/dashboard/Manga/MangaList';
import MangaChapterList from '../pages/dashboard/MangaChapter/MangaChapterList';
import ChapterList from '../pages/dashboard/Chapter/ChapterList';
import UserList from '../pages/dashboard/User/UserList';
import MangaDetailPage from '../components/common/ViewManga/MangaDetailPage';
import MangaChapterReader from '../components/common/ViewChapter/MangaChapterReader';
import SearchManga from '../components/common/SearchManga/SearchManga';
import NotificationsPage from '../components/common/Notification/NotificationPage';
import UploadManga from '../components/user/UploadManga/UploadManga';
import UserProfilePage from '../pages/dashboard/User/Profile/UserProfilePage';
import FollowingPage from '../pages/user/FollowingPage';
import UserChapterUploaded from '../pages/dashboard/UserChapterUploaded';
import UserMangaUploaded from '../pages/dashboard/UserMangaUploaded';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'auth/login', element: <Login /> },
      { path: 'auth/register', element: <Register /> },
      { path: 'manga/:mangaId', element: <MangaDetailPage /> },
      {
        path: 'manga/:mangaId/chapter/:chapterIndex',
        element: <MangaChapterReader />,
      },
      { path: 'search/manga', element: <SearchManga /> },
      {
        path: 'common/profile',
        element: <UserProfilePage />,
      },
      {
        path: 'upload',
        element: <UploadManga />,
      },
      {
        path: 'user/following',
        element: <FollowingPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/notification',
    element: <NotificationsPage />,
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
    path: '/dashboard/user-chapter-uploaded',
    element: <UserChapterUploaded />,
  },
  {
    path: '/dashboard/user-manga-uploaded',
    element: <UserMangaUploaded />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;

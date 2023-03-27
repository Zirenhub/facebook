import { createBrowserRouter } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import ProfilePage from '../pages/ProfilePage';
import ErrorPage from '../pages/ErrorPage';

import ProtectedRoute from '../components/ProtectedRoute';
import { MobileHeader } from '../components/HOC/MobileHeader';

import MobileHomePage from '../pages/Mobile/HomePage';
import Menu from '../pages/Mobile/Menu';
import Friends from '../pages/Mobile/Friends';
import Notifications from '../pages/Mobile/Notifications';

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <MobileHeader />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/home',
        element: <MobileHomePage />,
      },
      {
        path: '/:id',
        element: <ProfilePage isMobile />,
      },
      {
        path: '/menu',
        element: <Menu />,
      },
      {
        path: '/friends',
        element: <Friends />,
      },
      {
        path: '/notifications',
        element: <Notifications />,
      },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <AuthPage />,
  },
]);

export default router;

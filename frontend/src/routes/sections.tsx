import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const SchedulePage = lazy(() => import('src/pages/schedule'));
export const ContactUsPage = lazy(() => import('src/pages/contact'));
export const MyBookingsPage = lazy(() => import('src/pages/bookings'));
export const ReservationPage = lazy(() => import('src/pages/reservations'));
export const ReservationSuccessPage = lazy(() => import('src/pages/reservation-success'));
export const ReservationFailedPage = lazy(() => import('src/pages/reservation-failed'));
export const EWalletPage = lazy(() => import('src/pages/e-wallet'));
export const LocationTrackingPage = lazy(() => import('src/pages/location-tracking'));

export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RegisterPage = lazy(() => import('src/pages/register'));

export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'Schedule', element: <SchedulePage /> },
        { path: 'Contact', element: <ContactUsPage /> },
        { path: 'Bookings', element: <MyBookingsPage /> },
        { path: '/reservation/:booking_id', element: <ReservationPage /> },
        { path: '/reservation_success/:booking_id', element: <ReservationSuccessPage /> },
        { path: '/reservation_failed/:booking_id', element: <ReservationFailedPage /> },
        { path: '/ewallet', element: <EWalletPage /> },
        { path: '/location', element: <LocationTrackingPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}

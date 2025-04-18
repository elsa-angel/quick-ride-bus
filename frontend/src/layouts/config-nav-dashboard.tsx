import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Schedule',
    path: '/schedule',
    icon: icon('ic-user'),
  },
  {
    title: 'My Bookings',
    path: '/bookings',
    icon: icon('ic-user'),
  },
  {
    title: 'Contact Us',
    path: '/contact',
    icon: icon('ic-user'),
  },

  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];

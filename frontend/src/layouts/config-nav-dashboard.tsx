import { SvgColor } from 'src/components/svg-color';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

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
    icon: <EventNoteIcon />,
  },
  {
    title: 'My Bookings',
    path: '/bookings',
    icon: icon('ic-user'),
  },
  {
    title: 'Ewallets',
    path: '/ewallet',
    icon: icon('ic-user'),
  },
  {
    title: 'Contact Us',
    path: '/contact',
    icon: <PermContactCalendarIcon />,
  },
];

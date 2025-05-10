import { SvgColor } from 'src/components/svg-color';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import WalletIcon from '@mui/icons-material/Wallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
    icon: <DepartureBoardIcon />,
  },
  {
    title: 'Ewallet',
    path: '/ewallet',
    icon: <WalletIcon />,
  },
  {
    title: 'Location Tracking',
    path: '/location',
    icon: <LocationOnIcon />,
  },
  {
    title: 'Contact Us',
    path: '/contact',
    icon: <PermContactCalendarIcon />,
  },
];

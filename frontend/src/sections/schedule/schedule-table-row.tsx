import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';

import { LoadingButton } from '@mui/lab';

import axiosInstance from 'src/api/axios-instance';

import { useRouter, usePathname } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export type ScheduleProps = {
  id: string;
  user_id: string;
  bus_name: string;
  from: string;
  to: string;
  date: string;
  from_time: string;
  to_time: string;
  time_difference: string;
  fare: string;
};

type ScheduleTableRowProps = {
  row: ScheduleProps;
};

export function ScheduleTableRow({ row }: ScheduleTableRowProps) {
  const router = useRouter();

  const handleBookNow = async () => {
    try {
      const response = await axiosInstance.post('/bookings/', {
        schedule_id: row.id,
        user_id: row.user_id,
        booking_date: row.date,
        departure_stop: row.from,
        arrival_stop: row.to,
        fare: row.fare,
        reserved_seats: 'null',
        departure_time: row.from_time,
        arrival_time: row.to_time,
      });

      // window.location.href = `/reservation/${response?.data?.booking_id}`;
      router.push(`/reservation/${response?.data?.booking_id}`);
    } catch (error: any) {
      console.error('Booking Error:', error);
    }
  };

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell component="th" scope="row">
        {row.bus_name}
      </TableCell>
      <TableCell>{row.from}</TableCell>
      <TableCell>{row.to}</TableCell>
      <TableCell>{row.date}</TableCell>
      <TableCell>{row.from_time}</TableCell>
      <TableCell>{row.to_time}</TableCell>
      <TableCell>{row.time_difference}</TableCell>
      <TableCell>{row.fare}</TableCell>
      <TableCell>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="outlined"
          onClick={handleBookNow}
        >
          Book
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
}

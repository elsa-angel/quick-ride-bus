import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';

import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export type ScheduleProps = {
  id: string;
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
  const handleBookNow = () => {
    window.location.href = `/seats`;
  };

  return (
    <>
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
            variant="contained"
            onClick={handleBookNow}
            sx={{ width: 265, height: '56px' }}
          >
            Book Now
          </LoadingButton>
        </TableCell>
      </TableRow>
    </>
  );
}

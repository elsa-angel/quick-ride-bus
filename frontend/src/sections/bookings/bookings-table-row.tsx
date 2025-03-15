import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export type BookingsProps = {
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

type BookingsTableRowProps = {
  row: BookingsProps;
};

export function BookingsTableRow({ row }: BookingsTableRowProps) {
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
      </TableRow>
    </>
  );
}

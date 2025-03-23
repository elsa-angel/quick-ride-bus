import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';

export type BookingsProps = {
  id: number;
  bus_name: string;
  departure_stop: string;
  arrival_stop: string;
  booking_date: string;
  departure_time: string;
  arrival_time: string;
  amount: string;
  status: string;
};

type BookingsTableRowProps = {
  row: BookingsProps;
  onCancel: (id: number) => void;
  onView: (row: BookingsProps) => void;
};

export function BookingsTableRow({ row, onCancel, onView }: BookingsTableRowProps) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.bus_name}</TableCell>
      <TableCell>{row.departure_stop}</TableCell>
      <TableCell>{row.arrival_stop}</TableCell>
      <TableCell>{row.booking_date}</TableCell>
      <TableCell>{row.departure_time}</TableCell>
      <TableCell>{row.arrival_time}</TableCell>
      <TableCell>₹{row.amount}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <LoadingButton color="primary" variant="outlined" onClick={() => onView(row)}>
            View
          </LoadingButton>
          {row.status === 'paid' && (
            <LoadingButton color="error" variant="outlined" onClick={() => onCancel(row.id)}>
              Cancel
            </LoadingButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}

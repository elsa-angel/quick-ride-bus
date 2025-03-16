import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';

import { LoadingButton } from '@mui/lab';

import { useState } from 'react';

// ----------------------------------------------------------------------

export type BookingsProps = {
  id: string;
  bus_name: string;
  from: string;
  to: string;
  date: string;
  from_time: string;
  to_time: string;
  fare: string;
  status: string;
};

type BookingsTableRowProps = {
  row: BookingsProps;
};

export function BookingsTableRow({ row }: BookingsTableRowProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedResIndex, setSelectedResIndex] = useState(-1);
  const [bookingIdToCancel, setBookingIdToCancel] = useState<number | null>(null);

  const updateQrCodeView = (value: boolean, index = -1) => {
    if (index >= 0) {
      setSelectedResIndex(index);
    }
    setShowQRCode(value);
  };

  const handleCancelBooking = async (bookingId: number) => {
    setBookingIdToCancel(bookingId);
    setShowConfirm(true);
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
        <TableCell>{row.fare}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            // onClick={() => updateQrCodeView(true, index)}
            sx={{ width: 265, height: '56px' }}
          >
            View
          </LoadingButton>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            // onClick={() => handleCancelBooking(booking.id)}
            sx={{ width: 265, height: '56px' }}
          >
            View
          </LoadingButton>
        </TableCell>
      </TableRow>
    </>
  );
}

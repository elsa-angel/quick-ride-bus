import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';

import { LoadingButton } from '@mui/lab';

import Box from '@mui/material/Box';

import { useState, useEffect } from 'react';

import axiosInstance from 'src/api/axios-instance';

// ----------------------------------------------------------------------

export type BookingsProps = {
  id: string;
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
};

export function BookingsTableRow({ row }: BookingsTableRowProps) {
  const [bookings, setBookings] = useState<any[]>([]);
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
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell>{row.id}</TableCell>

      <TableCell>{row.bus_name}</TableCell>
      <TableCell>{row.departure_stop}</TableCell>
      <TableCell>{row.arrival_stop}</TableCell>
      <TableCell>{row.booking_date}</TableCell>
      <TableCell>{row.departure_time}</TableCell>
      <TableCell>{row.arrival_time}</TableCell>
      <TableCell>{row.amount}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <LoadingButton color="primary" variant="outlined">
            View
          </LoadingButton>
          <LoadingButton color="error" variant="outlined">
            Cancel
          </LoadingButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}

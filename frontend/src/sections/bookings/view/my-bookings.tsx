import { useState, useEffect } from 'react';
import axiosInstance from 'src/api/axios-instance';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { BookingsTableRow } from '../bookings-table-row';
import { BookingsTableHead } from '../bookings-table-head';
import ConfirmDialogue from './confirmdialogue';
import Ticket from './ticket';

type BookingsProps = {
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

export function BookingsView() {
  const [bookings, setBookings] = useState<BookingsProps[]>([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingIdToCancel, setBookingIdToCancel] = useState<number | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(`/reservations/`);
        console.log('Bookings:', response.data);
        setBookings(response.data?.reservations);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
    const intervalId = setInterval(fetchBookings, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCancelBooking = (bookingId: number) => {
    setBookingIdToCancel(bookingId);
    setShowConfirm(true);
  };

  const handleConfirmCancelBooking = async () => {
    if (bookingIdToCancel) {
      try {
        await axiosInstance.patch(`/reservations/cancel/${bookingIdToCancel}/`);
        setBookings(bookings.filter((booking) => booking.id !== bookingIdToCancel));
      } catch (error) {
        console.error('Error canceling booking:', error);
      } finally {
        setShowConfirm(false);
        setBookingIdToCancel(null);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setBookingIdToCancel(null);
  };

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setShowQRCode(true);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          My Bookings
        </Typography>
      </Box>

      {showConfirm && (
        <ConfirmDialogue
          open={showConfirm}
          onConfirm={handleConfirmCancelBooking}
          onCancel={handleCancel}
        />
      )}

      {showQRCode ? (
        <Ticket
          reservation={selectedBooking}
          user={selectedBooking.username}
          onClose={() => setShowQRCode(false)}
        />
      ) : (
        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <BookingsTableHead
                  headLabel={[
                    { id: 'booking_id', label: 'Booking ID' },
                    { id: 'bus_name', label: 'Bus Name' },
                    { id: 'from', label: 'Departure' },
                    { id: 'to', label: 'Arrival' },
                    { id: 'date', label: 'Date' },
                    { id: 'from_time', label: 'Departure Time' },
                    { id: 'to_time', label: 'Arrival Time' },
                    { id: 'fare', label: 'Amount' },
                    { id: 'status', label: 'Status' },
                    { id: '', label: 'Action' },
                  ]}
                />
                <TableBody>
                  {bookings?.map((row) => (
                    <BookingsTableRow
                      key={row.id}
                      row={row}
                      onCancel={handleCancelBooking}
                      onView={handleViewBooking}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      )}
    </DashboardContent>
  );
}

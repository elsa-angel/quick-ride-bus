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

// import { TableEmptyRows } from '../table-empty-rows';

// ----------------------------------------------------------------------

export function BookingsView() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(`/reservationlist/`);
        console.log('Bookings:', response.data);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    // Fetch bookings initially
    fetchBookings();

    // Set up interval to fetch bookings every minute
    const intervalId = setInterval(fetchBookings, 30000); // 60000 ms = 1 minute

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          My Bookings
        </Typography>
      </Box>

      <Card>
        {/* {bookings?.length ? ( */}
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
                {bookings.map((row: any) => (
                  <BookingsTableRow key={row.id} row={row} />
                ))}

                {/* <TableEmptyRows emptyRows={schedules?.length} height={68} /> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        {/* ) : null} */}
      </Card>
    </DashboardContent>
  );
}

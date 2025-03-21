import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, LinearProgress } from '@mui/material';
import axios from 'axios';
import axiosInstance from 'src/api/axios-instance';
import { log } from 'console';

interface BookingDetailsProps {
  bookingId: number;
  updateCurrentStep: (step: number) => void;
}

const Payment: React.FC<BookingDetailsProps> = ({ bookingId, updateCurrentStep }) => {
  const [bookingData, setBookingData] = useState<any>(null);
  const [progress, setProgress] = useState(100);

  const getBookingDetails = async () => {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      console.log('Booking Data:', response.data);
      setBookingData(response.data);
    } catch (error) {
      console.error('Error occurred', error);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, [bookingId]);

  const BOOKING = bookingData as any;

  const busName = BOOKING?.schedule?.bus?.bus_name;
  const from = BOOKING?.departure_stop;
  const to = BOOKING?.arrival_stop;
  const departure_time = BOOKING?.departure_time;
  const arrival_time = BOOKING?.arrival_time;
  const booking_date = BOOKING?.booking_date;

  const amount = BOOKING?.amount;
  //   const num_reserved_seats = parseInt(BOOKING?.reserved_seats?.split(',')?.length);
  const num_reserved_seats = BOOKING?.reserved_seats
    ? BOOKING?.reserved_seats.split(',').length
    : 0;
  const totalAmount = amount * num_reserved_seats;

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: 'background.default',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        margin: 'auto',
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom align="left">
        Confirm Your Reservation
      </Typography>

      {/* Booking Information */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Bus Name:
            </Typography>
            <Typography variant="body1">{busName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Booking Date:
            </Typography>
            <Typography variant="body1">{booking_date}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Departure:
            </Typography>
            <Typography variant="body1">{from}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Arrival:
            </Typography>
            <Typography variant="body1">{to}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Departure Time:
            </Typography>
            <Typography variant="body1">{departure_time}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Arrival Time:
            </Typography>
            <Typography variant="body1">{arrival_time}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Seats Reserved:
            </Typography>
            <Typography variant="body1">{num_reserved_seats}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Total Amount:
            </Typography>
            <Typography variant="body1">₹{totalAmount}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Buttons */}
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={() => updateCurrentStep(1)}>
          Go Back
        </Button>
        <Button variant="contained" color="primary">
          Pay Now
        </Button>
      </Box>
    </Box>
  );
};

export default Payment;

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Divider } from '@mui/material';
import axiosInstance from 'src/api/axios-instance';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { useLoadingBar } from 'react-top-loading-bar';
import { useRouter } from 'src/routes/hooks';

interface BookingDetailsProps {
  bookingId: number;
  updateCurrentStep: (step: number) => void;
}

const Payment: React.FC<BookingDetailsProps> = ({ bookingId, updateCurrentStep }) => {
  const router = useRouter();

  const [bookingData, setBookingData] = useState<any>(null);

  const { start, complete } = useLoadingBar({
    color: 'blue',
    height: 2,
  });

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        console.log('Booking Data:', response.data);
        setBookingData(response.data);
      } catch (error) {
        console.error('Error occurred', error);
      }
    };

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

  console.log('Booking ID:', BOOKING?.booking_id);

  const makePayment = async () => {
    start();
    const stripe = await loadStripe(
      'pk_test_51Q3wbuIMqVOQVQ5ADpdbpZYftHwMsC4gnTkN21xgQp6CgExTuxvhvXNv85xjLnaElL8rVrokgWeiRGpeFRc6QgWP00x0FwRJx6'
    );

    const session = await makeStripePayment();
    complete();
    stripe?.redirectToCheckout({
      sessionId: session.id,
    });
  };

  async function makeStripePayment() {
    // const stripe = require('stripe')(
    //   'sk_test_51Q3wbuIMqVOQVQ5AbRLzJrBynzDiHtpcVrieYFPfImc4kgw8BYkimtnILsPzV4aEv2jI5zGhJUduy7CyEaZVHrJY00Jcgc7EXC'
    // )

    const stripe = new Stripe(
      'sk_test_51Q3wbuIMqVOQVQ5AbRLzJrBynzDiHtpcVrieYFPfImc4kgw8BYkimtnILsPzV4aEv2jI5zGhJUduy7CyEaZVHrJY00Jcgc7EXC'
    );

    const transaction = await stripe.products.create({
      name: 'Transaction A',
      // default_price_data: {
      //   unit_amount: 20000,
      //   currency: 'inr'
      // },
      // expand: ['default_price']
    });

    const price = await stripe.prices.create({
      product: transaction.id,
      unit_amount: totalAmount * 100,
      currency: 'inr',
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'payment',
      success_url: `http://localhost:3039/reservation_success/${BOOKING.booking_id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3039/reservation_failed/${BOOKING.booking_id}`,
      // success_url: `http://172.18.0.1:3039/reservation_success/${BOOKING.booking_id}?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `http://172.18.0.1:3039/reservation_failed/${BOOKING.booking_id}`,
    });
    return session;
  }

  const payWithEwallet = async () => {
    try {
      start();
      const response = await axiosInstance.post(`/ewalletpayment/${bookingId}/`, {
        amount: totalAmount,
      });
      console.log('API Response:', response.data);
      if (!response.data.success) {
        //   alert('Sufficient eWallet Balance');
        // } else {
        alert('Insufficient eWallet Balance');
      }
      complete();
      const transactionId = response.data.transaction.id;
      console.log('Transaction ID:', transactionId);
      if (transactionId) {
        router.push(`/reservation_success/${BOOKING.booking_id}?transaction_id=${transactionId}`);
      } else {
        console.error('Transaction ID is missing in the response');
      }
      // router.push(`/reservation_success/${BOOKING.booking_id}?transaction_id=${transactionId}`);
    } catch (error) {
      complete();
      console.error('Error during eWallet payment', error);
    }
  };

  const formatLocation = (location: string): string => {
    if (!location) return '';
    return location
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
            <Typography variant="body1">{formatLocation(from)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Arrival:
            </Typography>
            <Typography variant="body1">{formatLocation(to)}</Typography>
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
        <Button variant="contained" color="primary" onClick={makePayment}>
          Pay Now
        </Button>
      </Box>
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>
      <Box gap={1} display="flex" justifyContent="center">
        <Button variant="contained" color="inherit" onClick={payWithEwallet}>
          Pay with Ewallet
        </Button>
      </Box>
    </Box>
  );
};

export default Payment;

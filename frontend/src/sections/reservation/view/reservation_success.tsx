import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { DashboardContent } from 'src/layouts/dashboard';
import '../reservation.css';
import axiosInstance from 'src/api/axios-instance';

const stripe = new Stripe(
  'sk_test_51Q3wbuIMqVOQVQ5AbRLzJrBynzDiHtpcVrieYFPfImc4kgw8BYkimtnILsPzV4aEv2jI5zGhJUduy7CyEaZVHrJY00Jcgc7EXC'
);

const ReservationSuccessView: React.FC = () => {
  const location = useLocation();

  // Function to get the query parameters
  const getQueryParams = () => {
    const query = new URLSearchParams(location.search);
    return {
      sessionId: query.get('session_id'),
    };
  };

  const { sessionId } = getQueryParams();

  // Get Booking Data using booking_id
  const url = window.location.href;
  const parsedUrl = new URL(url);
  const bookingId = parsedUrl.pathname.split('/')[2]; // This gets the 3rd segment of the path
  //   const totalAmount = bookingData?.amount * (bookingData?.reserved_seats?.split(',').length || 0);

  useEffect(() => {
    const makeReservation = async () => {
      if (!sessionId || !bookingId) return;

      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId as string);
        const bookings = await axiosInstance.get(`/bookings/${bookingId}`);

        const amount = bookings.data.amount;
        const num_reserved_seats = bookings.data?.reserved_seats
          ? bookings.data?.reserved_seats.split(',').length
          : 0;
        const totalAmount = amount * num_reserved_seats;

        const reservationData = {
          schedule_id: bookings?.data?.schedule?.id,
          user_id: bookings?.data?.user_id,
          payment_id: stripeSession.id,
          amount: totalAmount,
          status: stripeSession?.payment_status,
          departure_stop: bookings?.data?.departure_stop,
          departure_time: bookings?.data?.departure_time,
          arrival_stop: bookings?.data?.arrival_stop,
          arrival_time: bookings?.data?.arrival_time,
          qr_code: 'null',
          reserved_seats: bookings?.data?.reserved_seats,
          booking_date: bookings?.data?.booking_date,
        };

        await axiosInstance.post('/reservations/', reservationData);
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    makeReservation();
  }, [sessionId, bookingId]); // ✅ Only include necessary dependencies

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={5}>
        <Typography variant="h4" mb={3}>
          Reserve Your Tickets
        </Typography>
      </Box>

      <Box className="_success">
        {' '}
        {/* Applying the _success class for success box */}
        <h2>Your payment was successful!</h2>
        <p>Thank you for your payment. Your reservation has been confirmed.</p>
        {/* Success Animation */}
        <div className="success-animation">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 52 52"
            fill="none"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              d="M14 27l7 7 17-17"
            />
          </svg>
        </div>
        {/* QR Code */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <QRCode value={sessionId as string} size={128} />
        </Box>
        {/* Buttons */}
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" color="primary" href="/bookings">
            View My Bookings
          </Button>
        </Box>
      </Box>
    </DashboardContent>
  );
};

export default ReservationSuccessView;

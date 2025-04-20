import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Stripe from 'stripe';
import { DashboardContent } from 'src/layouts/dashboard';
import '../ewallet.css';
import axiosInstance from 'src/api/axios-instance';

const stripe = new Stripe(
  'sk_test_51Q3wbuIMqVOQVQ5AbRLzJrBynzDiHtpcVrieYFPfImc4kgw8BYkimtnILsPzV4aEv2jI5zGhJUduy7CyEaZVHrJY00Jcgc7EXC'
);

const EwalletSuccessView: React.FC = () => {
  const location = useLocation();

  const [balance, setBalance] = useState<number | null>(null);

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
    const updateEwalletBalance = async () => {
      try {
        const amount = localStorage.getItem('Ewallet_amount');

        console.log('Amount:', amount);

        const response = await axiosInstance.post('/ewalletupdate/', { amount, sessionId });

        if (response.data.new_balance !== undefined) {
          setBalance(response.data.new_balance);
        }
      } catch (error: any) {
        console.error('Error occurred:', error);
      }
    };
    updateEwalletBalance();
  }, [sessionId]);

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={5}>
        <Typography variant="h4" mb={3}>
          Ewallet Payment
        </Typography>
      </Box>

      <Box className="_success">
        {' '}
        {/* Applying the _success class for success box */}
        <h2>Your payment was successful!</h2>
        <p>Thank you for your payment. Your payment has been confirmed.</p>
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
      </Box>
    </DashboardContent>
  );
};

export default EwalletSuccessView;

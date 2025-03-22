import React from 'react';
import { Box, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import '../reservation.css';

const ReservationFailedView: React.FC = () => (
  <DashboardContent>
    <Box display="flex" flexDirection="column" alignItems="flex-start" mb={5}>
      <Typography variant="h4" mb={3}>
        Reserve Your Tickets
      </Typography>
    </Box>

    <Box className="_failed">
      <h2>Your payment was Failed.</h2>
      <p>Try again later!</p>
      <div className="fail-animation">
        <svg className="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="crossmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path className="crossmark__cross" fill="none" d="M16 16l20 20M16 36l20-20" />
        </svg>
      </div>
    </Box>
  </DashboardContent>
);

export default ReservationFailedView;

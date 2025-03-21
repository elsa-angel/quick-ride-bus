import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';

import { DashboardContent } from 'src/layouts/dashboard';
import axiosInstance from 'src/api/axios-instance';

import axios from 'axios';

// import SeatAvailabilityView from '../seat-availability';
import { SeatAvailabilityView } from '../seat-availability';
import Payment from '../payment';

export default function ReservationView() {
  const { booking_id } = useParams();
  // const history = useHistory(); // To navigate to other routes if needed

  const [bookingData, setBookingData] = useState<any>(null);
  const [isBookingLoading, setBookingLoading] = useState<boolean>(true);
  const [totalSeats, setTotalSeats] = useState<number>(0);
  // const [currentStep, setCurrentStep] = useState<number>(0);
  const [bookingId, setBookingId] = useState<number>(1); // Example booking ID

  // Fetch booking details
  const getBookingDetails = async () => {
    try {
      const response = await axiosInstance.get(`/bookings/${booking_id}`);
      setBookingData(response.data);
      setTotalSeats(response.data?.schedule?.bus?.num_seats);
      setBookingLoading(false);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    if (booking_id) {
      getBookingDetails();
    }
  }, [booking_id]);

  // Stepper component
  const [currentStep, setCurrentStep] = useState(1);

  const updateCurrentStep = (step: number) => {
    setCurrentStep(step);
  };

  if (isBookingLoading) {
    return <h1>Loading...</h1>;
  }

  // Convert booking_id to a number
  const bookingIdAsNumber = booking_id ? parseInt(booking_id, 10) : NaN;

  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={5}>
        <Typography variant="h4" mb={3}>
          Reserve Your Tickets
        </Typography>
      </Box>

      <Box>
        {/* Step 1: Seat Availability */}
        {currentStep === 1 && !isBookingLoading && (
          <SeatAvailabilityView
            // bookingId={booking_id as number}
            bookingId={bookingIdAsNumber}
            fare={bookingData?.amount}
            totalSeats={totalSeats}
            updateCurrentStep={updateCurrentStep}
          />
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && !isBookingLoading && (
          <Payment bookingId={bookingIdAsNumber} updateCurrentStep={updateCurrentStep} />
        )}
      </Box>
    </DashboardContent>
  );
}

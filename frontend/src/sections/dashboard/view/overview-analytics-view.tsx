import React, { useEffect, useState } from 'react';
import axiosInstance from 'src/api/axios-instance';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Button, Card, CardContent, CardMedia } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/layouts/components/AuthContext';
import { WidgetSummary } from '../widget-summary';
import { BusVisits } from '../bus-visits';
import { PaymentMethods } from '../payment-methods';

export function OverviewAnalyticsView() {
  const { authUser } = useAuth();
  const isAdmin = authUser?.isSuperUser;

  const [busStats, setBusStats] = useState({ categories: [], series: [] });
  const [userStats, setUserStats] = useState({ categories: [], series: [] });
  const [messageStats, setMessageStats] = useState({ categories: [], series: [] });
  const [reservationStats, setReservationStats] = useState({ categories: [], series: [] });
  const [busVisits, setBusVisits] = useState({ series: [] });
  const [paymentStats, setPaymentStats] = useState({ categories: [], series: [] });

  const [upcomingReservations, setUpcomingReservations] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      const fetchBusStats = async () => {
        try {
          const response = await axiosInstance.get('/bus-creation-stats/');
          setBusStats({
            categories: response.data.categories,
            series: response.data.series,
          });
        } catch (error) {
          console.error('Error fetching bus creation stats:', error);
        }
      };

      fetchBusStats();
    }
    if (isAdmin) {
      const fetchUserStats = async () => {
        try {
          const response = await axiosInstance.get('/user-creation-stats/');
          setUserStats({
            categories: response.data.categories,
            series: response.data.series,
          });
        } catch (error) {
          console.error('Error fetching user creation stats:', error);
        }
      };

      fetchUserStats();
    }
    if (isAdmin) {
      const fetchMessageStats = async () => {
        try {
          const response = await axiosInstance.get('/message-creation-stats/');
          setMessageStats(response.data);
        } catch (error) {
          console.error('Error fetching message stats:', error);
        }
      };

      fetchMessageStats();
    }
    if (isAdmin) {
      const fetchReservationStats = async () => {
        try {
          const response = await axiosInstance.get('/reservation-creation-stats/');
          setReservationStats(response.data);
        } catch (error) {
          console.error('Error fetching reservation stats:', error);
        }
      };

      fetchReservationStats();
    }
    if (isAdmin) {
      const fetchBusVisits = async () => {
        try {
          const response = await axiosInstance.get('/bus-visits/');
          setBusVisits(response.data);
        } catch (error) {
          console.error('Error fetching current bus visits:', error);
        }
      };

      fetchBusVisits();
    }
    if (isAdmin) {
      const fetchPaymentStats = async () => {
        try {
          const response = await axiosInstance.get('/payment-method-stats/');
          setPaymentStats(response.data);
        } catch (error) {
          console.error('Error fetching payment method stats:', error);
        }
      };

      fetchPaymentStats();
    }
  }, [isAdmin]);

  const fetchUpcomingReservations = async () => {
    try {
      const response = await axiosInstance.get('/upcoming-reservations/');
      setUpcomingReservations(response.data.upcoming_reservations);
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error);
    }
  };
  useEffect(() => {
    if (authUser?.user?.id) {
      fetchUpcomingReservations();
    }
  }, [authUser]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome back, {authUser?.user?.name} 👋
      </Typography>
      {isAdmin ? (
        <div>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <WidgetSummary
                title="Buses"
                percent={2.6} // You can adjust this if you want
                total={busStats.series.reduce((acc, val) => acc + val, 0)} // Total number of buses
                icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bus.svg" />} // Replace the icon
                chart={{
                  categories: busStats.categories,
                  series: busStats.series,
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <WidgetSummary
                title="New users"
                percent={-0.1}
                total={userStats.series.reduce((acc, val) => acc + val, 0)} // Total number of users
                color="secondary"
                icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
                chart={{
                  categories: userStats.categories,
                  series: userStats.series,
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <WidgetSummary
                title="Bookings"
                percent={2.8}
                total={reservationStats.series.reduce((total, num) => total + num, 0)} // Total reservations from the series data
                color="warning"
                icon={<img alt="icon" src="/assets/icons/glass/ic-glass-booking.svg" />}
                chart={{
                  categories: reservationStats.categories,
                  series: reservationStats.series,
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <WidgetSummary
                title="Messages"
                percent={3.6}
                total={messageStats.series.reduce((total, num) => total + num, 0)}
                color="error"
                icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
                chart={{
                  categories: messageStats.categories,
                  series: messageStats.series,
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid xs={12} md={6} lg={6}>
              <BusVisits
                title="Bus Visits"
                chart={{
                  series: busVisits.series,
                }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={6}>
              <PaymentMethods
                title="Payment Methods"
                subheader="(+43%) than last year"
                chart={{
                  categories: paymentStats.categories,
                  series: paymentStats.series,
                }}
              />
            </Grid>
          </Grid>
        </div>
      ) : (
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ mb: { xs: 2, md: 4 } }}>
            Your Upcoming Reservations:
          </Typography>

          <Grid container spacing={3}>
            {upcomingReservations.map((reservation) => (
              <Grid xs={12} sm={6} md={4} key={reservation.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {reservation.departure_stop
                        .toLowerCase()
                        .split(' ')
                        .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}{' '}
                      to{' '}
                      {reservation.arrival_stop
                        .toLowerCase()
                        .split(' ')
                        .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Departure Time: {reservation.departure_time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Departure Date: {reservation.departure_date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Seats Reserved: {reservation.reserved_seats}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Amount: ₹{reservation.amount}
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                      <Button variant="contained" color="primary" href="/bookings">
                        View more details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </DashboardContent>
  );
}

import React, { useEffect, useState } from 'react';
import axiosInstance from 'src/api/axios-instance';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
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

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
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
        <Typography variant="h6" sx={{ mb: { xs: 2, md: 4 } }}>
          Explore your bus reservations.
        </Typography>
      )}
    </DashboardContent>
  );
}

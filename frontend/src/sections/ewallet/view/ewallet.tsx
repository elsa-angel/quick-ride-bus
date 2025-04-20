import { useState, useEffect } from 'react';
import axiosInstance from 'src/api/axios-instance';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DashboardContent } from 'src/layouts/dashboard';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { useLoadingBar } from 'react-top-loading-bar';

import Payment from 'src/sections/reservation/payment';

export function EWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const { start, complete } = useLoadingBar({
    color: 'blue',
    height: 2,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/transactions/');
        const transactionData = response?.data;
        setTransactions(transactionData);
        setBalance(transactionData[transactionData.length - 1]?.ewallet?.balance || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  const handleTopUp = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAmount('');
  };

  // const handleContinue = () => {
  //   // Call your API here to top-up with `amount`
  //   console.log('Top up with: ', amount);
  //   handleClose();
  // };

  const handleContinue = async () => {
    localStorage.setItem('Ewallet_amount', amount);

    if (!amount || Number.isNaN(Number(amount))) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      start();

      const stripe = await loadStripe(
        'pk_test_51Q3wbuIMqVOQVQ5ADpdbpZYftHwMsC4gnTkN21xgQp6CgExTuxvhvXNv85xjLnaElL8rVrokgWeiRGpeFRc6QgWP00x0FwRJx6'
      );

      // Create Stripe session
      const session = await makeStripePayment(amount);
      complete();

      // Redirect to Stripe Checkout page
      stripe?.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error('Error while creating Stripe session:', error);
      complete();
    }

    handleClose();
  };

  async function makeStripePayment(topUpAmount: string) {
    const stripe = new Stripe(
      'sk_test_51Q3wbuIMqVOQVQ5AbRLzJrBynzDiHtpcVrieYFPfImc4kgw8BYkimtnILsPzV4aEv2jI5zGhJUduy7CyEaZVHrJY00Jcgc7EXC'
    );

    // Create product and price
    const product = await stripe.products.create({
      name: 'Wallet Top-Up',
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Number(topUpAmount) * 100, // Convert to cents
      currency: 'inr',
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'payment',
      success_url: `http://localhost:3039/ewallet_success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3039/reservation_failed`,
    });

    return session;
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          E-Wallet
        </Typography>
      </Box>
      <Box minWidth={720} mx="auto" my={4}>
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #3f51b5, #1a237e)',
            color: 'white',
          }}
        >
          <Typography variant="h6">My Balance</Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">₹{balance.toFixed(2)}</Typography>
            <Button
              variant="contained"
              onClick={handleTopUp}
              sx={{
                backgroundColor: 'white',
                color: '#1a237e',
                borderRadius: 5,
                textTransform: 'none',
              }}
            >
              <AddIcon /> Add Money
            </Button>
          </Box>
        </Paper>

        <Typography mt={4} mb={2} variant="h6">
          Transaction History
        </Typography>
        <Paper>
          <List>
            {transactions.map((trans: any, index) => (
              <>
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{ backgroundColor: trans.type === 'credit' ? '#81c784' : '#e57373' }}
                    >
                      {trans.type === 'credit' ? '+' : '-'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={trans.title}
                    secondary={`${formatDate(trans.date)} - ₹${trans.amount}`}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </List>
        </Paper>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Add Money</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Enter amount"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Grid container spacing={1} my={2}>
              {[100, 200, 300, 400, 500, 600, 700, 800].map((val) => (
                <Grid item xs={3} key={val}>
                  <Button variant="outlined" fullWidth onClick={() => setAmount(val.toString())}>
                    ₹{val}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              fullWidth
              onClick={handleContinue}
              sx={{ backgroundColor: '#1a237e', color: 'white', borderRadius: 3 }}
            >
              Continue
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </DashboardContent>
  );
}

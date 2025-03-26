import { useState, useEffect } from 'react';
import axiosInstance from 'src/api/axios-instance';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';

import Grid from '@mui/material/Grid';
import { Paper } from '@mui/material';
import '../ewallet.css';

export function EWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/transactions/');
        const transactionData = response?.data;
        console.log(response?.data);
        setTransactions(transactionData);
        setBalance(transactionData[transactionData.length - 1]?.ewallet?.balance || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);

  //   if (isNaN(date.getTime())) return 'Invalid Date'; // Check if date is invalid

  //   const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
  //   const year = date.getFullYear();

  //   return `${day} ${month} ${year}`;
  // };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          E-Wallet
        </Typography>
      </Box>

      <div className="ewallet-container">
        <div className="wallet">
          <aside className="left-wallet">
            <div className="wallet-head">
              <h1>My Wallets</h1>
            </div>
          </aside>
          <div className="right-trans">
            <h1>Current Balance</h1>
            <h4 id="balance">₹{balance.toFixed(2)}</h4>
            <div className="trans-list" style={{ display: 'block' }}>
              {' '}
              {transactions?.map((trans: any, index) => (
                <div key={index} className="trans trans-visa">
                  {' '}
                  <div className="trans-details">
                    {' '}
                    <span className={trans.type === 'credit' ? 'trans-plus' : 'trans-minus'}>
                      &nbsp;
                    </span>{' '}
                    <h3 className="trans-name">{trans.title}</h3>{' '}
                    <h5 className="trans-type-date">
                      {}
                      {new Date(trans.created_at).toLocaleString()}
                      {/* {formatDate(trans.created_at)} */}
                    </h5>{' '}
                  </div>{' '}
                  <div className="trans-amt">
                    {' '}
                    <h4
                      className={
                        trans.type === 'credit' ? 'trans-amt amt-green' : 'trans-amt amt-blue'
                      }
                    >
                      ₹{trans.amount}
                    </h4>{' '}
                  </div>{' '}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardContent>
  );
}

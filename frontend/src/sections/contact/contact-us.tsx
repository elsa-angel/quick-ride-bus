import { useState, useCallback } from 'react';
import { Box, Card, Typography, TextField, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import { DashboardContent } from 'src/layouts/dashboard';
import axiosInstance from 'src/api/axios-instance';

// ----------------------------------------------------------------------

export function ContactUsView() {
  const [data, setData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validateForm = () => {
        const formErrors = { ...errors };
        let isValid = true;

        if (!data.name) {
          formErrors.name = 'Please enter your name';
          isValid = false;
        } else {
          formErrors.name = '';
        }

        if (!data.email) {
          formErrors.email = 'Please enter your email';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
          formErrors.email = 'Please enter a valid email';
          isValid = false;
        } else {
          formErrors.email = '';
        }

        if (!data.message) {
          formErrors.message = 'Please enter your message';
          isValid = false;
        } else {
          formErrors.message = '';
        }

        setErrors(formErrors);
        return isValid;
      };

      if (!validateForm()) return;

      try {
        const response = await axiosInstance.post('/contact/', { data });
        console.log(response);

        if (response) {
          setData({ name: '', email: '', message: '' });
          setErrors({ name: '', email: '', message: '' });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [data, errors]
  );

  return (
    <DashboardContent>
      {/* Top Heading */}
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Contact Us
        </Typography>
      </Box>

      {/* Contact Form and Contact Info Section */}
      <Box display="flex" justifyContent="center">
        <Card sx={{ maxWidth: 1100, width: '100%', boxShadow: 3, borderRadius: 2, p: 5 }}>
          <Grid container spacing={10} alignItems="center">
            {/* Left Side - Contact Form */}
            <Grid item xs={12} md={6} sx={{ pr: 4 }}>
              {' '}
              {/* Added right padding for space */}
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Send Us a Message
              </Typography>
              <Box component="form" display="flex" flexDirection="column" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Your name"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />

                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="yourname@example.com"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />

                <TextField
                  fullWidth
                  name="message"
                  label="Message"
                  value={data.message}
                  onChange={(e) => setData({ ...data, message: e.target.value })}
                  placeholder="Write your message here"
                  InputLabelProps={{ shrink: true }}
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                  error={Boolean(errors.message)}
                  helperText={errors.message}
                />

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 1.2,
                    fontWeight: 'bold',
                    backgroundImage: 'linear-gradient(135deg, #3f51b5, #1a237e)',
                    '&:hover': {
                      backgroundImage: 'linear-gradient(135deg, #3f51b5, #1a237e)',
                    },
                  }}
                >
                  Submit
                </LoadingButton>
              </Box>
            </Grid>

            {/* Right Side - Contact Info */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                backgroundImage: 'linear-gradient(135deg, #3f51b5, #1a237e)',
                borderRadius: 2,
                p: 4,
                pl: 8, // Increased left padding for more space
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                minHeight: '100%',
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={3} color="white">
                Contact Information
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                <LocationOnIcon sx={{ color: 'white', mr: 2 }} />
                <Typography variant="body1" color="white">
                  123 Main Street, Kochi, Kerala 682001, India
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ color: 'white', mr: 2 }} />
                <Typography variant="body1" color="white">
                  admin@qrb.com
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <PhoneIcon sx={{ color: 'white', mr: 2 }} />
                <Typography variant="body1" color="white">
                  +91 484 2398123
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </DashboardContent>
  );
}

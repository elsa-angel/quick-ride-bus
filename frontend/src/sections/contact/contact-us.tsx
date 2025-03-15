import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import { DashboardContent } from 'src/layouts/dashboard';

import axiosInstance from 'src/api/axios-instance';

// ----------------------------------------------------------------------

export function ContactUsView() {
  const [data, setData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent form submission from refreshing the page

      // Form validation function
      const validateForm = () => {
        const formErrors = { ...errors };
        let isValid = true;

        // Check if 'name' field is empty
        if (!data.name) {
          formErrors.name = 'Please enter your name';
          isValid = false;
        } else {
          formErrors.name = '';
        }

        // Check if 'email' field is empty or invalid
        if (!data.email) {
          formErrors.email = 'Please enter your email address';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
          formErrors.email = 'Please enter a valid email address';
          isValid = false;
        } else {
          formErrors.email = '';
        }

        // Check if 'message' field is empty
        if (!data.message) {
          formErrors.message = 'Please enter your message';
          isValid = false;
        } else {
          formErrors.message = '';
        }

        setErrors(formErrors);
        return isValid;
      };

      if (!validateForm()) {
        // Stop the form submission if validation fails
        return;
      }
      try {
        const response = await axiosInstance.post('/contact/', { data });
        console.log(response);

        if (response) {
          setData({
            name: '',
            email: '',
            message: '',
          });

          setErrors({
            name: '',
            email: '',
            message: '',
          });
        }

        // if (response) {
        //   setErrors(response.errors);
        // } else {
        //   // Handle successful registration
        //   console.log('User registered:', response);
        //   // Redirect or perform additional actions
        // }
        // router.push('/schedule');
      } catch (error) {
        console.error('Error :', error);
      }
      // setProcessing(false);
    },
    [data, errors]
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Contact Us
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {/* Name Field */}
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Your name"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          {/* Email Field */}
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="yourname@example.com"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          {/* Message Field */}
          <TextField
            fullWidth
            name="message"
            label="Message"
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            placeholder="Write your message here"
            InputLabelProps={{ shrink: true }}
            multiline
            rows={4} // Adjust the height of the text area
            sx={{ mb: 3 }}
            error={Boolean(errors.message)}
            helperText={errors.message}
          />

          {/* Submit Button */}
          <LoadingButton
            fullWidth
            size="large"
            type="button"
            color="inherit"
            variant="contained"
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
        </Box>
      </Card>
    </DashboardContent>
  );
}

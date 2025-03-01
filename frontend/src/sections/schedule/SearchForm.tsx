import React, { useState, useCallback } from 'react';
import { TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import axiosInstance from 'src/api/axios-instance';

function SearchForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const formErrors = { ...errors };
    let isValid = true;

    // Check if all fields are filled
    if (!formData.from) {
      formErrors.from = 'Please enter your departure city';
      isValid = false;
    } else {
      formErrors.from = '';
    }

    if (!formData.to) {
      formErrors.to = 'Please enter your destination city';
      isValid = false;
    } else {
      formErrors.to = '';
    }

    if (!formData.date) {
      formErrors.date = 'Please select a date';
      isValid = false;
    } else {
      formErrors.date = '';
    }

    if (!formData.time) {
      formErrors.time = 'Please select a time';
      isValid = false;
    } else {
      formErrors.time = '';
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      // Stop the form submission if validation fails
      return;
    }
    try {
      const response = await axiosInstance.post('/schedule/', { formData });
      console.log(response);

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
  }, []);

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-end" gap={1}>
      <TextField
        fullWidth
        name="from"
        label="From"
        placeholder="Your Departure City"
        value={formData.from}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 265 }}
        error={Boolean(errors.from)}
        helperText={errors.from}
      />
      &nbsp;
      <TextField
        fullWidth
        name="to"
        label="To"
        placeholder="Your Destination City"
        value={formData.to}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 265 }}
        error={Boolean(errors.to)}
        helperText={errors.to}
      />
      &nbsp;
      <TextField
        fullWidth
        name="date"
        label="Date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 265 }}
        inputProps={{
          min: new Date().toISOString().split('T')[0],
        }}
        error={Boolean(errors.date)}
        helperText={errors.date}
      />
      &nbsp;
      <TextField
        fullWidth
        name="time"
        label="Time"
        type="time"
        value={formData.time}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 265 }}
        inputProps={
          {
            // min: new Date().toTimeString().slice(0, 5),
          }
        }
        error={Boolean(errors.time)}
        helperText={errors.time}
      />
      &nbsp;
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
        sx={{ width: 265, height: '56px' }}
      >
        Search
      </LoadingButton>
    </Box>
  );
}

export default SearchForm;

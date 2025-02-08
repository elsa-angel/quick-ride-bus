import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

function SearchForm() {
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

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted with data:', formData);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="row"
      alignItems="flex-end"
      gap={1}
    >
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
        inputProps={{
          min: new Date().toTimeString().slice(0, 5),
        }}
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
        sx={{ width: 265, height: '56px' }}
      >
        Search
      </LoadingButton>
    </Box>
  );
}

export default SearchForm;

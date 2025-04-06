import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { RouterLink } from 'src/routes/components';

import axiosInstance from 'src/api/axios-instance';
// ----------------------------------------------------------------------

export function RegisterView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = useCallback(async () => {
    const validateForm = () => {
      const formErrors = { ...errors };
      let isValid = true;

      // Validate name
      if (!data.name) {
        formErrors.name = 'Please enter your name';
        isValid = false;
      } else {
        formErrors.name = '';
      }

      // Validate email
      if (!data.email) {
        formErrors.email = 'Please enter your email address';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        formErrors.email = 'Please enter a valid email address';
        isValid = false;
      } else {
        formErrors.email = '';
      }

      // Validate password
      if (!data.password) {
        formErrors.password = 'Please enter your password';
        isValid = false;
      } else if (data.password.length < 5) {
        formErrors.password = 'Password should be at least 5 characters long';
        isValid = false;
      } else {
        formErrors.password = '';
      }

      // Validate confirm password
      if (data.password !== data.confirmPassword) {
        formErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      } else {
        formErrors.confirmPassword = '';
      }

      setErrors(formErrors);
      return isValid;
    };

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axiosInstance.post('/register', { data });
      console.log(response);

      // Redirect to home page or another page after successful registration
      router.push('/');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }, [router, data, errors]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="name"
        label="Name"
        value={data.name}
        onChange={handleChange}
        placeholder="name"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={data.email}
        onChange={handleChange}
        placeholder="hello@gmail.com"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        error={!!errors.email}
        helperText={errors.email}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={data.password}
        onChange={handleChange}
        placeholder="@demo1234"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        error={!!errors.password}
        helperText={errors.password}
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        value={data.confirmPassword}
        onChange={handleChange}
        placeholder="@demo1234"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleRegister}
      >
        Register
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Register</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link href="/sign-in" component={RouterLink} variant="subtitle2" sx={{ ml: 0.5 }}>
            Sign in
          </Link>
        </Typography>
      </Box>

      {renderForm}

      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
      </Box> */}
    </>
  );
}

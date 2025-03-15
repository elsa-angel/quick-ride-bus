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

import { useAuth } from '../../layouts/components/AuthContext';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const { authUser, setAuthUser } = useAuth();

  const handleSignIn = useCallback(async () => {
    // Validate form
    const validateForm = () => {
      const formErrors = { ...errors };
      let isValid = true;

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
      } else {
        formErrors.password = '';
      }

      setErrors(formErrors);
      return isValid;
    };

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axiosInstance.post('/login', { data });
      console.log(response);

      setAuthUser(response?.data);
      router.push('/');
    } catch (error) {
      console.error('Error during login:', error);
    }
  }, [router, data, errors, setAuthUser]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        error={!!errors.email}
        helperText={errors.email}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link href="/register" component={RouterLink} variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
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
      </Box>
    </>
  );
}

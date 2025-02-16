import { useState, useEffect, useCallback } from 'react';

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

import axios from 'axios';
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

  // const [errors, setErrors] = useState({
  //   name: '',
  //   email: '',
  //   password: '',
  //   confirmPassword: '',
  // });
  // const [processing, setProcessing] = useState(false);

  // // Reset form fields on component unmount
  // useEffect(() => {
  //   return () => {
  //     setData({
  //       name: '',
  //       email: '',
  //       password: '',
  //       confirmPassword: '',
  //     });
  //   };
  // }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // if (data.password !== data.confirmPassword) {
  //   setErrors({
  //     name: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: 'Not same password',
  //   });
  //   return;
  // } else {
  //   setErrors({
  //     name: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: '',
  //   });
  // }

  // setProcessing(true);
  // Make the actual API call here for registration

  const handleRegister = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/register', { data });
      console.log(response);

      // if (response) {
      //   setErrors(response.errors);
      // } else {
      //   // Handle successful registration
      //   console.log('User registered:', response);
      //   // Redirect or perform additional actions
      // }
      router.push('/');
    } catch (error) {
      console.error('Error registering user:', error);
    }
    // setProcessing(false);
  }, [router, data]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="name"
        label="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="name"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        placeholder="hello@gmail.com"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
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
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        value={data.confirmPassword}
        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
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
      {/* 
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider> */}

      {/* <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </>
  );
}

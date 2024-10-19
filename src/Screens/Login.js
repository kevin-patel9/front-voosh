import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Container, Box, Typography, Link } from '@mui/material';
import { loginUserApi } from '../APIs/LoginApi';
import { useNavigate } from 'react-router-dom';
import { UserAuthContext } from '../App';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(UserAuthContext);
  
  const navigate = useNavigate();

  const initialValues = {
    userID: '',
    password: '',
  };

  const validationSchema = Yup.object({
    userID: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  });


  const onSubmit = async (values) => {
    const response = loginUserApi(values.userID, values.password);
    if (response?.message?.includes("User already exist") || response?.message?.includes("incorrect password")){
      setErrorMessage(response?.message);
      return;
    }

    navigate("/task");
    setIsLoggedIn(false);
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box marginBottom={2}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  label="User ID"
                  name="userID"
                  helperText={<ErrorMessage name="userID" />}
                  error={Boolean(<ErrorMessage name="userID" />)}
                />
              </Box>
              <Box marginBottom={2}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  helperText={<ErrorMessage name="password" />}
                  error={Boolean(<ErrorMessage name="password" />)}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                Login
              </Button>
              <Typography sx={{ color: "red", fontSize: 12, marginTop: 2 }}>
                  {errorMessage}
                </Typography>
              <Box marginTop={2} textAlign="center">
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link href="/signup" variant="body2">
                    Signup
                  </Link>
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                style={{ marginTop: '1rem' }}
              >
                Login with Google
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;

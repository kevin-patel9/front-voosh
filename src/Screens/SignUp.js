// src/Signup.js
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
Button,
TextField,
Container,
Box,
Typography,
Link,
} from "@mui/material";
import { registerUserApi } from "../APIs/LoginApi";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        function getCookie(name) {
            const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
            return cookieValue ? cookieValue.pop() : "";
        }
    
        if (getCookie("token") != "")
            navigate("/task");
      }, []);  

const initialValues = {
    userID: "",
    name: "",
    password: "",
    confirmPassword: "",
};

const validationSchema = Yup.object({
    userID: Yup.string().required("Required").min(4),
    name: Yup.string().required("Required").min(4),
    password: Yup.string().required("Required").min(6),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const onSubmit = async (values, { resetForm, setSubmitting }) => {
    const response = await registerUserApi(values.userID, values.name, values.password);
    setMessage(response.message);
    resetForm();
    setSubmitting(false);
    
    setTimeout(() => {
        setMessage("");
    }, 4000)

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
                Signup
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
            {({ isSubmitting, handleSubmit }) => (
                <Form>
                <Box marginBottom={2}>
                    <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    label="userID"
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
                    label="Name"
                    name="name"
                    helperText={<ErrorMessage name="name" />}
                    error={Boolean(<ErrorMessage name="name" />)}
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
                <Box marginBottom={2}>
                    <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    helperText={<ErrorMessage name="confirmPassword" />}
                    error={Boolean(<ErrorMessage name="confirmPassword" />)}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                >
                    Signup
                </Button>
                <Typography sx={{ color: "red", fontSize: 12, textAlign: "center", marginTop: 2 }}>
                    {message}
                </Typography>
                <Box marginTop={2} textAlign="center">
                    <Typography variant="body2">
                    Already have an account?{" "}
                    <Link href="/" variant="body2">
                        Login
                    </Link>
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "1rem" }}
                >
                    Signup with Google
                </Button>
                </Form>
            )}
            </Formik>
        </Box>
    </Container>
);
};

export default Signup;

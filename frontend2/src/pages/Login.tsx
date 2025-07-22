import { useFormik } from "formik";
import * as Yup from "yup";

import axiosInstance from "../utils/axiosInstance";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import { makeStyles } from "@fluentui/react";
import { fetchUser } from "../Auth/userService";
import { useState } from "react";

const useStyle = makeStyles({
  form: {
    padding: "30px 20px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    gap: "16px",
    width: "390px",
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputDiv: {
    display: "flex",
    flexDirection: "column",
    gap: '5px'
  },
  label: {
    color: "#555",
    fontWeight: 500,
    fontSize: "14px",
  },
  input: {
    border: "1px solid #909090",
    outline: "none",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "5px",
    backgroundColor: "#E8F0FE",
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    "&:focus": {
      borderColor: "#0078d4",
      boxShadow: "0 0 0 4px rgb(176, 205, 248)",
      
    },
  },
  select: {
    border: "1px solid #909090",
    padding: "8px",
    borderRadius: "5px",
    backgroundColor: "#E8F0FE",
    fontSize: "14px",
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    "&:focus": {
      borderColor: "#0078d4",
      boxShadow: "0 0 0 4px rgb(176, 205, 248)",
    },
  },
  error: {
    color: "#d93025",
    fontSize: "12px",
    marginTop: "2px",
  },
  button: {
    padding: "12px 16px",
    backgroundColor: "#0078d4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: 400,
    margin: '10px 0',
    fontSize: "14px",

    ":hover": {
      backgroundColor: "#005a9e",
    },
  },
});

export const Login = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const {login, setUser, user} =useAuth();
  const [error, setError] = useState<string | null>(null)
  
  if(user){
    navigate('/')
  }
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be 6 characters or more")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        const res = await axiosInstance.post("/Auth/login", values);
        const token = res?.data?.token;
        if(token) {
          login(token);
          fetchUser()
                .then(setUser)
          resetForm();
          navigate('/client');

        }else {
          console.log('something went wrong')
          return;
        }
      } catch (error) {
  const axiosError = error as AxiosError;

  if (axiosError.response?.data) {
    /* eslint-disable */
    const errorMsg = (axiosError.response.data as any)|| 'Login failed';
    /* eslint-enable */

    setError(errorMsg);
  } else {
    setError("An unknown error occurred");
  }
}
 finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <img src="/logo.svg" alt="logo" style={{width: '150px', height: '150px', margin: '0 auto'}}/>
        <h1 style={{ textAlign: "center", color: "darkcyan" }}>Login</h1>
        <div className={classes.container}>
          <div className={`${classes.inputDiv}`}>
            <label htmlFor="email" className={classes.label}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={classes.input}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className={classes.error}>{formik.errors.email}</div>
            )}
          </div>

          <div className={`${classes.inputDiv} `}>
            <label htmlFor="password" className={classes.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={classes.input}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className={classes.error}>{formik.errors.password}</div>
            )}
          </div>
        </div>

        <button
          className={classes.button}
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Submitting..." : "Log in"}
        </button>
        {error? <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>{error}</p>:""}
      <p style={{textAlign: 'end'}}>New User? <Link style={{color: 'blue'}} to={'/signup'}>signup</Link></p>
      </form>

    </div>
  );
};

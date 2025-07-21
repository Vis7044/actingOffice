
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import axiosInstance from "../utils/axiosInstance";
  import { AxiosError } from "axios";
  import { Link, useNavigate } from "react-router-dom";
  import { makeStyles } from "@fluentui/react";
  import { useAuth } from "../utils/useAuth";
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
      width: "600px", 
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    fullWidth: {
      gridColumn: "span 2",
    },
    inputDiv: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
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
      padding: "10px 16px",
      backgroundColor: "#0078d4",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "14px",
      alignSelf: "flex-end",
      
        ":hover": {
          backgroundColor: "#005a9e",
        },
      
    },
  });


  export const Signup = () => {
    const classes = useStyle();
    const navigate = useNavigate();
    const {user} = useAuth()
    const [error, setError] = useState<string | null>(null)

    if(user) {
      navigate('/')
    }

    const formik = useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        role: "",
      },
      validationSchema: Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(6, "Must be 6 characters or more")
          .required("Required"),
        dateOfBirth: Yup.date() .max(new Date(Date.now() - 86400000), "Date of birth cannot be in the future").required("Required"),
        role: Yup.string().required("Required"),
      }),
      onSubmit: async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      await axiosInstance.post("/Auth/register", values);
      resetForm();
      navigate('/login');
    } catch (error) {
      const axiosError =error as AxiosError;
      
      if(axiosError.response){
        /* eslint-disable */

        setError(axiosError.response.data as any);
        /* eslint-enable */

      }else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
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

          <h1 style={{textAlign: 'center', color: 'darkcyan'}}>Signup</h1>
        <div className={classes.gridContainer}>

      <div className={classes.inputDiv}>
        <label htmlFor="firstName" className={classes.label}>First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          className={classes.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <div className={classes.error}>{formik.errors.firstName}</div>
        )}
      </div>

      <div className={classes.inputDiv}>
        <label htmlFor="lastName" className={classes.label}>Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          className={classes.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <div className={classes.error}>{formik.errors.lastName}</div>
        )}
      </div>

      <div className={`${classes.inputDiv} ${classes.fullWidth}`}>
        <label htmlFor="email" className={classes.label}>Email Address</label>
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

      <div className={`${classes.inputDiv} ${classes.fullWidth}`}>
        <label htmlFor="password" className={classes.label}>Password</label>
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

      <div className={classes.inputDiv}>
        <label htmlFor="dateOfBirth" className={classes.label}>DOB</label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          className={classes.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.dateOfBirth}
        />
        {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
          <div className={classes.error}>{formik.errors.dateOfBirth}</div>
        )}
      </div>

      <div className={classes.inputDiv}>
        <label htmlFor="role" className={classes.label}>Role</label>
        <select
          id="role"
          name="role"
          className={classes.select}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
        >
          <option value="">Select role</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
          <option value="Manager">Manager</option>
        </select>
        {formik.touched.role && formik.errors.role && (
          <div className={classes.error}>{formik.errors.role}</div>
        )}
      </div>
    </div>

    <button
    className={classes.button}
    type="submit"
    disabled={formik.isSubmitting}
  >
    {formik.isSubmitting ? "Submitting..." : "Submit"}
  </button>
   {error? <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>{error}</p>:""}
  <p style={{textAlign: 'end'}}>Already have an account? <Link style={{color: 'blue'}} to={'/login'}>Login</Link></p>
  </form>
            

      
      </div>
    );
  };

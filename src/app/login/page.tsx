"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import '../../assets/styles/style.css';
import { IoMailOutline } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 const [errors, setErrors] = useState({
    email: "",
   password:""
  });


  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });


    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }


  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("formData : ", formData);

    axios
      .post("/api/login", formData)
      .then((res) => {
        console.log("res : ", res);
        if (res.status === 200) {
          console.log("Login success");
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Login success . Email Sent");
          // router.push("/dashboard");
          window.location.href = "/dashboard";

        }
      })
      .catch((err) => {
        console.log("err : ", err);
        if (err.response.status === 400) {
          toast.error(err.response.data.error);
          console.log("err.response.error : ", err.response.data.error);
        
        } 
        else if (err.response.status === 401) {
          toast.error(err.response.data.error);
      
       
        } 
        else if (err.response.status === 403) {
          toast.error(err.response.data.error);
      
       
        } 
        else if (err.response.status === 402) {
          toast.error(err.response.data.error);
        }
        else if (err.response.status === 404) {
          toast.error(err.response.data.error);
        }
        else if (err.response.status === 500) {
          toast.error("Server error. Please try again later.");
        }
         else {
          toast.error("Something went wrong. Please try again.");
        }
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="row g-0">
          {/* Left Side - Image */}
          <div className="col-lg-6 d-none d-lg-block">
            <div
              className="auth-image"
              style={{
                backgroundImage: "url('/images/bg.png')",
                objectFit: "cover",
              }}
            >
              <div className="overlay"></div>
              <div className="auth-image-content">
                <div className="logo-container">
                  <img src="/images/logo.png" alt="Logo" className="logo-img" />
                </div>
                <h2>Welcome Back!</h2>
                <p>
                  Login to access your account and bring along your buddy for
                  amazing experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-lg-6">
            <div className="auth-form-container">
              <div className="mobile-logo d-lg-none text-center mb-4">
                <img
                  src="/images/logo.png"
                  alt="Bring Your Buddy"
                  className="mobile-logo-img"
                />
              </div>

              <h3 className="auth-title">Sign In</h3>
              <p className="auth-subtitle">
                Welcome back! Please enter your credentials to continue.
              </p>

              <Form
                id="loginForm"
                className="auth-form"
                onSubmit={submitHandler}
              >
                <Form.Group className="form-group mb-4" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group input-group-merge">
                    <span className="input-group-text">
                      <IoMailOutline />
                    </span>
                    <Form.Control
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="name@example.com"
                      required
                    />
                    {errors.email && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.email}
                              </div>
                            )}
                  </div>
                  <div className="invalid-feedback"></div>
                </Form.Group>

                <Form.Group
                  className="form-group mb-3"
                  controlId="formPassword"
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label>Password</Form.Label>
                    <span onClick={() => { router.push("/forget-password")}} className="forgot-password">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="input-group input-group-merge">
                    <span className="input-group-text">
                      <IoIosLock />
                    </span>
                    <Form.Control
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                    <span className="input-group-text password-toggle">
                      <FaRegEyeSlash className="far fa-eye" />
                    </span>
                  </div>
                  <div className="invalid-feedback"></div>
                </Form.Group>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  className="btn btn-primary btn-auth w-100"
                >
                  Sign In
                </Button>

          
              </Form>

              <div className="text-center mt-4">
                <p className="auth-link">
                  Don't have an account? <a href="/register">Sign Up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

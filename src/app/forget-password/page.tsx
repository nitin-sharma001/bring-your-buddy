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
    email : ""
  });
 const [errors, setErrors] = useState({
    email: ""
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
      .post("/api/resend-otp", formData)
      .then((res) => {
        console.log("res : ", res);
        if (res.status === 200) {
          console.log("Login success");
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast("Otp Send success . Email Sent");
          router.push("/forget-password/verify");

        
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
                <h2>Enter Your Email !</h2>
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



                <Button
                  type="submit"
                  className="btn btn-primary btn-auth w-100"
                >
                  Submit 
                </Button>

              </Form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

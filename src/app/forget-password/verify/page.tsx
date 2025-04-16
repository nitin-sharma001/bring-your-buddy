"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaLock, FaArrowRight, FaRedo, FaEnvelope } from "react-icons/fa";
import '../../../assets/styles/style.css';

const VerifyPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/login");
    }
    
    startResendTimer();
  }, [router]);
  
  const startResendTimer = () => {
    setIsResendDisabled(true);
    setTimer(60);
    
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };

  const handleChange = (value: string, index: number) => {
    if (value === "" || /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus to next input
      if (value !== "" && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedOtp = otp.join("");
    
    if (combinedOtp.length === 4) {
      setLoading(true);
      
      axios.post("/api/verify-otp", { email, otp: combinedOtp })
        .then((res) => {
          if (res.data.message === "success") {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            toast.success("OTP verified successfully!");
            localStorage.setItem("document_verified", "0");
            localStorage.setItem("offerletter", "0");
            router.push("/forget-password/add-new");

        

          } else {
            toast.error("Invalid OTP. Please try again.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("An error occurred. Please try again.");
          setLoading(false);
        });
    } else {
      toast.error("Please enter a valid 4-digit OTP.");
    }
  };

  const resendOtpHandler = () => {
    if (isResendDisabled) return;
    
    setLoading(true);
    axios.post("/api/resend-otp", { email })
      .then((res) => {
        if (res.data.message === "success") {
          toast.success("OTP resent successfully!");
          startResendTimer();
        } else {
          toast.error("Email not registered");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to resend OTP");
        setLoading(false);
      });
  };
  
  const maskEmail = (email: string) => {
    if (!email) return "";
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
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
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="overlay"></div>
              <div className="auth-image-content">
                <div className="logo-container">
                  <img src="/images/logo.png" alt="Logo" className="logo-img" />
                </div>
                <h2>Verify Your Identity</h2>
                <p>
                  We've sent a 4-digit verification code to your email. Enter
                  the code to continue with your application.
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

              <h3 className="auth-title">Email Verification</h3>
              <p className="auth-subtitle">
                Enter the 4-digit code sent to your email
              </p>

              <div className="email-sent-info mb-4">
                <div className="d-flex align-items-center">
                  <div className="email-icon">
                    <FaEnvelope />
                  </div>
                  <div className="email-details">
                    <p className="mb-0">We sent code to</p>
                    <p className="fw-bold mb-0">{maskEmail(email)}</p>
                  </div>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="otp-input-container mb-4">
                  <label className="form-label">Verification Code</label>
                  <div className="d-flex justify-content-between gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <Form.Control
                        key={`otp-field-${index}`}
                        id={`otp-${index}`}
                        className="otp-input text-center"
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="resend-container mb-4 d-flex justify-content-center align-items-center text-danger">
                  <Button
                    variant="link"
                    className="resend-button p-0 d-flex justify-content-center align-items-center text-danger gap-2"
                    onClick={resendOtpHandler}
                    disabled={isResendDisabled || loading}
                  >
                    <FaRedo className="me-1" />
                    {isResendDisabled ? `Resend in ${timer}s` : "Resend Code"}
                  </Button>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    ""
                  )}
                  {loading ? "Verifying..." : "Verify & Continue"}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="auth-link">
                  Didn't receive the email? Check your spam folder or
                  <Button
                    variant="link"
                    className="p-0 ms-1"
                    onClick={resendOtpHandler}
                    disabled={isResendDisabled || loading}
                  >
                    try again
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .otp-input {
          width: 60px;
          height: 60px;
          font-size: 24px;
          font-weight: 600;
          border-radius: 8px;
          border: 1px solid var(--gray-light);
          background-color: var(--white);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .otp-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(251, 2, 0, 0.1);
          transform: translateY(-2px);
        }

        .email-sent-info {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
        }

        .email-icon {
          background-color: rgba(251, 2, 0, 0.1);
          color: var(--primary);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 16px;
        }

        .resend-button {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .resend-button:hover:not(:disabled) {
          color: var(--primary-hover);
          transform: translateY(-1px);
        }

        .resend-button:disabled {
          color: var(--gray);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default VerifyPage;

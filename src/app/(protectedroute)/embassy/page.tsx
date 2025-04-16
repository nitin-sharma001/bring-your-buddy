"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { IoIosCloudUpload } from "react-icons/io";

const Page = () => {
  const [formData, setFormData] = useState({
    email : "",
    date: "",
    date_document: null,
  });

  const [embassyformData, setEmbassyFormData] = useState({
    email: "",
    result_document: null,
  });

  const [visaformData, setVisaFormData] = useState({
    email: "",
    visa_document: null,
  });

  useEffect(() => {

    const email = JSON.parse(localStorage.getItem("user")).email;
    formData.email = email
    embassyformData.email = email;
    visaformData.email = email;

  }, [])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date_document: e.target.files?.[0] || null });

  };
    const handleResFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 
      setEmbassyFormData({
        ...embassyformData,
        result_document: e.target.files?.[0] || null,
      });
    };
     const handleVisaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setVisaFormData({
         ...visaformData,
         visa_document: e.target.files?.[0] || null,
       });
     };

  const dateUploadHandler = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);

        console.log(key, formData[key]);
      }
    });

    axios
      .post("/api/appointment-notification", formDataToSend)
      .then((res) => {
        console.log("appointment-notification : ", res);

        toast.success("Appointment Date Upload Successfully !")
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const embassyResultHandler = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(embassyformData).forEach((key) => {
      if (embassyformData[key]) {
        formDataToSend.append(key, embassyformData[key]);

        console.log(key, embassyformData[key]);
      }
    });

    axios
      .post("/api/embassy", formDataToSend)
      .then((res) => {
        console.log("embassy ", res);
        toast.success("Embassy Result Upload Successfully !");

      })
      .catch((err) => {
        console.log(err);
      });
  }
  const VisaResultHandler = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(visaformData).forEach((key) => {
      if (visaformData[key]) {
        formDataToSend.append(key, visaformData[key]);

        console.log(key, visaformData[key]);
      }
    });

    axios
      .post("/api/embassy/visa-result", formDataToSend)
      .then((res) => {
        console.log("embassy -visa-result ", res);
        toast.success("Visa Upload Successfully !");

      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h5 className="section-divider">Upload Appointment Date</h5>

      <Row>
        <Col md={3}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">Date</Form.Label>
            <div className="custom-file-upload">
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleDateChange}
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Document
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="date_document"
                id="date_document"
                className="file-input"
                accept="application/pdf, image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="date_document" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>

              {formData.date_document && (
                <div className="file-preview">
                  <span>{formData.date_document.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="align-items-center">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
            <Button onClick={dateUploadHandler} variant="primary">
              Upload
            </Button>
          </div>
        </Col>
      </Row>

      <h5 className="section-divider">Upload Embassy Result</h5>

      <Row>
        <Col md={4}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Document
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="result_document"
                id="result_document"
                className="file-input"
                accept="application/pdf, image/*"
                onChange={handleResFileChange}
              />
              <label htmlFor="result_document" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>

              {embassyformData.result_document && (
                <div className="file-preview">
                  <span>{formData.result_document?.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="align-items-center">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
            <Button onClick={embassyResultHandler} variant="primary">
              Upload
            </Button>
          </div>
        </Col>
      </Row>

      <h5 className="section-divider">Upload Copy of Visa</h5>

      <Row>
        <Col md={4}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Visa Document
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="visa_document"
                id="visa_document"
                className="file-input"
                accept="application/pdf, image/*"
                onChange={handleVisaFileChange}
              />
              <label htmlFor="visa_document" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>

              {visaformData.visa_document && (
                <div className="file-preview">
                  <span>{formData.visa_document?.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="align-items-center">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
            <Button onClick={VisaResultHandler} variant="primary">
              Upload
            </Button>
          </div>
        </Col>
      </Row>

      <style jsx global>{`
        .profile-container {
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--primary-blue), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }

        .profile-content {
          margin-top: 1rem;
        }

        .profile-card,
        .contact-info-card,
        .edit-profile-card {
          border: none;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          overflow: hidden;
        }

        .profile-avatar-container {
          display: flex;
          justify-content: center;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 42px;
          font-weight: bold;
          margin-bottom: 1rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .gradient-blue {
          background: linear-gradient(135deg, var(--primary-blue), var(--teal));
        }

        .profile-badge {
          margin: 0 0.3rem;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          font-weight: 500;
        }

        .document-status {
          text-align: left;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .contact-info-card {
          margin-top: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .contact-icon {
          margin-right: 1rem;
          font-size: 1.2rem;
          color: var(--primary-blue);
        }

        .card-title {
          margin-bottom: 1.5rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-icon {
          margin-right: 0.5rem;
          color: var(--primary-blue);
        }

        .section-divider {
          margin: 2rem 0 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          color: var(--text-color);
          font-weight: 600;
        }

        .custom-file-upload {
          position: relative;
          overflow: hidden;
          display: block;
          width: 100%;
        }

        .file-input {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .file-label {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-light);
          color: var(--primary-blue);
          padding: 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 2px dashed var(--primary-blue);
          margin-bottom: 0;
        }

        .file-label:hover {
          background-color: rgba(26, 115, 232, 0.1);
          transform: translateY(-2px);
        }

        .upload-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
        }

        .file-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: var(--primary-light);
          border-radius: 4px;
        }

        .form-actions {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
        }

        .submit-btn {
          background: linear-gradient(
            135deg,
            var(--primary-blue),
            var(--teal)
          ) !important;
          border: none !important;
          padding: 0.6rem 1.5rem;
          font-weight: 500;
          box-shadow: 0 4px 10px rgba(26, 115, 232, 0.2);
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(26, 115, 232, 0.3);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 1rem;
          }

          .profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;

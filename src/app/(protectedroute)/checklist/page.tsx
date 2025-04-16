"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { IoIosCloudUpload } from 'react-icons/io';

const page = () => {

    const [formData, setFormData] = useState({
        user_id : "",
      offer_letter: null,
      admission_letter: null,
      bonafide_certificate: null,
      student_undertaking_form: null,
    });

    const [student_undertaking, setStudentUndertaking] = useState(null);
    const [bonafide_certificat, setBonafidecertificate] = useState(null);
    const [admission_lette, setAdmissionLetter] = useState(null);
    const [offer_lette, setOfferLetter] = useState(null);

    const [checkbox, setCheckBox] = useState(false);
    const [userid, setUserId] = useState(0);

    const handleCheckBox = () => {
        setCheckBox((prev) => !prev);
    }



    useEffect(() => {

        
    const user_id = JSON.parse(localStorage.getItem("user")).id;

    formData.user_id = user_id || "";

    console.log("user_id : ", user_id);
    setUserId(user_id);

    }, [])



  const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [e.target.name]: file });

      }

      const previewUrl = URL.createObjectURL(file);
      if (e.target.name === "bonafide_certificate") {
        setBonafidecertificate(previewUrl);
      } else if (e.target.name === "student_undertaking_form") {
        setStudentUndertaking(previewUrl);
      } else if (e.target.name === "admission_letter") {
        setAdmissionLetter(previewUrl);
      } else if (e.target.name === "offer_letter") {
        setOfferLetter(previewUrl);
      }
    };

      const handleSubmit = async (e) => {
        e.preventDefault();
      

        setLoading(true);
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);

            console.log(key, formData[key]);
            
          }
        });

        try {
          toast.loading("Uploading...");
          const res = await fetch("/api/checklist-documents", {
            method: "POST",
            body: formDataToSend,
          });



        //   if (datares.success == "true"){
        //         toast.success("Uploaded Successfully !")
        //   }
            // axios.post("/api/getuserbyemail", { email }).then((res) => {
            //   console.log(res.data);

            //   localStorage.setItem("user", JSON.stringify(res.data.user));
            // });

          const data = await res.json();
          toast.dismiss();
          setLoading(false);

          console.log(data);

          console.log(res);
          

            if (res.ok) {
              toast.success("Uploaded Successfully !");
            } else {
              toast.error(data.error || "Something went wrong");
            }

            window.location.href =
              "https://www.india.gov.in/topics/foreign-affairs/embassy-consulates";
            
        } catch (error) {
          setLoading(false);
          toast.dismiss();
          toast.error("Failed to Upload");
        }
      };

  return (
    <div>
      <h5 className="section-divider">CheckList Documents</h5>

      <Row>
        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Offer Letter
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="offer_letter"
                id="offer_letter"
                className="file-input"
                onChange={handleFileChange}
                accept="application/pdf, image/*"
              />
              <label htmlFor="offer_letter" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>
              {offer_lette && (
                <div className="file-preview">
                  <span>File selected</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Admission Letter
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="admission_letter"
                id="admission_letter"
                className="file-input"
                onChange={handleFileChange}
                accept="application/pdf, image/*"
              />
              <label htmlFor="admission_letter" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>
              {admission_lette && (
                <div className="file-preview">
                  <span>File selected</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Bonafide Certificate
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="bonafide_certificate"
                id="bonafide_certificate"
                className="file-input"
                onChange={handleFileChange}
                accept="application/pdf, image/*"
              />
              <label htmlFor="bonafide_certificate" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>
              {bonafide_certificat && (
                <div className="file-preview">
                  <span>File selected</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Student Undertaking
              Form
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="student_undertaking_form"
                id="student_undertaking_form"
                className="file-input"
                onChange={handleFileChange}
                accept="application/pdf, image/*"
              />
              <label htmlFor="student_undertaking_form" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>
              {student_undertaking && (
                <div className="file-preview">
                  <span>File selected</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-3">
        <input
          id="for-checkbox"
          checked={checkbox}
          onChange={handleCheckBox}
          type="checkbox"
        />
        <label htmlFor="for-checkbox">Complete Your file</label>
      </div>

      <div className="d-flex align-items-center justify-content-center pt-5">
        {checkbox ? (
          <Button onClick={handleSubmit} variant="primary">
            Upload Documents
          </Button>
        ) : (
          <p>Please tick the CheckBox first !</p>
        )}
      </div>

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
}

export default page

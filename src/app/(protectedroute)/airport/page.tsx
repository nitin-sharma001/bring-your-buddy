"use client"

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { IoIosCloudUpload } from "react-icons/io";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    photo_document: null as File | null,
  });

  const [ticketData, setTicketData] = useState({
    email: "",
    departure_datetime: "",
    departure_port: "",
    destination_port: "",
    destination_datetime: "",
    ticket_document: null as File | null,
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const email = JSON.parse(user).email;
      setFormData(prev => ({ ...prev, email }));
      setTicketData(prev => ({ ...prev, email }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, photo_document: e.target.files?.[0] || null });
  };

  const handleTicketFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketData({ ...ticketData, ticket_document: e.target.files?.[0] || null });
  };

  const handleTicketInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const ResultHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append('email', formData.email);
    if (formData.photo_document) {
      formDataToSend.append('photo_document', formData.photo_document);
    }

    axios
      .post("/api/airport-pickup", formDataToSend)
      .then((res) => {
        console.log("photo-result ", res);
        toast.success("Photo Upload Successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload photo");
      });
  };

  const ticketUploadHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Append all ticket data fields
    formDataToSend.append('email', ticketData.email);
    formDataToSend.append('departure_datetime', ticketData.departure_datetime);
    formDataToSend.append('departure_port', ticketData.departure_port);
    formDataToSend.append('destination_port', ticketData.destination_port);
    formDataToSend.append('destination_datetime', ticketData.destination_datetime);
    
    if (ticketData.ticket_document) {
      formDataToSend.append('ticket_document', ticketData.ticket_document);
    }

    axios
      .post("/api/airport-pickup/airport-ticket", formDataToSend)
      .then((res) => {
        console.log("ticket-upload-result ", res);
        toast.success("Ticket details uploaded successfully!");
        // Reset form after successful upload (optional)
        setTicketData(prev => ({
          ...prev,
          departure_datetime: "",
          departure_port: "",
          destination_port: "",
          destination_datetime: "",
          ticket_document: null
        }));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload ticket details");
      });
  };

  return (
    <div>
      <h5 className="section-divider">Upload Your Flight Ticket Details</h5>

      <Row>
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>Departure Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="departure_datetime"
              value={ticketData.departure_datetime}
              onChange={handleTicketInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>Departure Airport/Port</Form.Label>
            <Form.Control
              type="text"
              name="departure_port"
              placeholder="e.g., JFK International Airport"
              value={ticketData.departure_port}
              onChange={handleTicketInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>Destination Airport/Port</Form.Label>
            <Form.Control
              type="text"
              name="destination_port"
              placeholder="e.g., Heathrow Airport"
              value={ticketData.destination_port}
              onChange={handleTicketInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>Arrival Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="destination_datetime"
              value={ticketData.destination_datetime}
              onChange={handleTicketInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Ticket Photo/PDF
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="ticket_document"
                id="ticket_document"
                className="file-input"
                accept="application/pdf, image/*"
                onChange={handleTicketFileChange}
              />
              <label htmlFor="ticket_document" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>

              {ticketData.ticket_document && (
                <div className="file-preview">
                  <span>{ticketData.ticket_document.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
          <Button 
            onClick={ticketUploadHandler} 
            variant="primary" 
            className="mb-4 w-100 h-50"
            disabled={
              !ticketData.departure_datetime || 
              !ticketData.departure_port || 
              !ticketData.destination_port || 
              !ticketData.destination_datetime || 
              !ticketData.ticket_document
            }
          >
            Upload Ticket Details
          </Button>
        </Col>
      </Row>

      <h5 className="section-divider">Upload Your Airport Pickup Photo</h5>

      <Row>
        <Col md={4}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Photo
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="photo_document"
                id="photo_document"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="photo_document" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>

              {formData.photo_document && (
                <div className="file-preview">
                  <span>{formData.photo_document?.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="align-items-center">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
            <Button 
            disabled={
              !formData.photo_document
            }
             onClick={ResultHandler} variant="primary">
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

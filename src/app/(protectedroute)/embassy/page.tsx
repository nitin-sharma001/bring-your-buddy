"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, ProgressBar } from "react-bootstrap";
import toast from "react-hot-toast";
import { IoIosCloudUpload } from "react-icons/io";
import { getUserProperty } from "@/utils/localStorage";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    date: "",
    time: "",
    date_document: null as File | null,
  });

  const [embassy_email, setEmbassyEmail] = useState("");

  const [userId , setUserId] = useState<string | null>(null);
  const [documentsExist, setDocumentsExist] = useState(false);
  const [embassyformData, setEmbassyFormData] = useState({
    email: "",
    result_document: null as File | null,
    status: "pending", 
    progress: 30, 
  });

  const [visaResultData, setVisaResultData] = useState({
    email: "",
    visa_result_document: null as File | null,
    status: "",
  });

  const [visaformData, setVisaFormData] = useState({
    email: "",
    visa_document: null as File | null,
    daysRemaining: 28, 
    visaGranted: false,
    processing: false,
    uploadDeadline: 7, 
    uploadDeadlineExpired: false,
  });

  const [appointemntStatus, setAppointemntStatus] = useState(false);
  const [embassyStatus, setEmbassyStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  const getembassyStatus = async (id : any) => {
    
        const response = await fetch(`/api/embassy/embasy-doc-status?user_id=${id}`);
          const data = await response.json();
          
          if (data.success && data.documents) {
            setEmbassyStatus(true);
            
          
          }
  }

  useEffect(  () => {
    setLoading(true);

    const id = getUserProperty<any, 'id'>('id');
    if (!id) {
      toast.error("User ID not found");
      setLoading(false);
      return;
    }
    
    axios
        .post("/api/appointment-notification/getreminder", { id })
        .then((res) => {

          if(res.data.reminders.appointment_date){
            setAppointemntStatus(true);
          }
          
        })
        .catch((err) => {
          console.log(err);
        });

getembassyStatus(id)


  }, [])

  useEffect(() => {
    const user = localStorage.getItem("user");


    if (user) {
      const email = JSON.parse(user).email;
      const id = JSON.parse(user).id;
      setUserId(id);
      setFormData((prev) => ({ ...prev, email }));
      setEmbassyFormData((prev) => ({ ...prev, email }));
      setVisaResultData((prev) => ({ ...prev, email }));
      setVisaFormData((prev) => ({ ...prev, email }));

    }

    let timer: NodeJS.Timeout;
    if (visaformData.processing) {
      timer = setInterval(() => {
        setVisaFormData((prev) => {
          if (prev.daysRemaining > 0) {
            return { ...prev, daysRemaining: prev.daysRemaining - 1 };
          } else {
            clearInterval(timer);
            return { ...prev, processing: false };
          }
        });
      }, 86400000); 
    }

    let uploadTimer: NodeJS.Timeout;
    if (
      visaResultData.status === "issued" &&
      !visaformData.uploadDeadlineExpired
    ) {
      uploadTimer = setInterval(() => {
        setVisaFormData((prev) => {
          if (prev.uploadDeadline > 0) {
            return { ...prev, uploadDeadline: prev.uploadDeadline - 1 };
          } else {
            clearInterval(uploadTimer);
            return { ...prev, uploadDeadlineExpired: true };
          }
        });
      }, 86400000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (uploadTimer) clearInterval(uploadTimer);
    };
  }, [
    visaformData.processing,
    visaResultData.status,
    visaformData.uploadDeadlineExpired,
  ]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, time: e.target.value });
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

  const handleVisaResultFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVisaResultData({
      ...visaResultData,
      visa_result_document: e.target.files?.[0] || null,
    });
  };

  const handleVisaStatusChange = (status: string) => {
    setVisaResultData({
      ...visaResultData,
      status,
    });
  };

  const handleVisaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisaFormData({
      ...visaformData,
      visa_document: e.target.files?.[0] || null,
    });
  };

  const handleEmbassyEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmbassyEmail(e.target.value);
  };

  const dateUploadHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Type-safe way to append formData fields
    formDataToSend.append("email", formData.email);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("time", formData.time);
    if (formData.date_document) {
      formDataToSend.append("date_document", formData.date_document);
    }

    axios
      .post("/api/appointment-notification", formDataToSend)
      .then((res) => {
        console.log("appointment-notification : ", res);
        toast.success("Appointment Date and Time Upload Successfully!");
        setAppointemntStatus(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload appointment details");
      });

      axios.post("/api/embassy/save-email", {embassy_email, email : formData.email}).then((res) => {
        console.log("embassy email saved successfully : ", res);
        
      }).catch((err) => {
        console.log(err);
        
      })
  };

  const embassyResultHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("email", embassyformData.email);
    if (embassyformData.result_document) {
      formDataToSend.append("result_document", embassyformData.result_document);
    }

    axios
      .post("/api/embassy", formDataToSend)
      .then((res) => {
        console.log("embassy ", res);
        toast.success("Embassy Result Upload Successfully!");
        // Update status after successful upload

        setEmbassyStatus(true);
        setEmbassyFormData((prev) => ({
          ...prev,
          status: "processing",
          progress: 65,
        }));

        // Simulate progress update (in a real app, you would track actual progress)
        setTimeout(() => {
          setEmbassyFormData((prev) => ({
            ...prev,
            status: "completed",
            progress: 100,
          }));
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload embassy result");
      });
  };

  const visaResultHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("email", visaResultData.email);
    formDataToSend.append("status", visaResultData.status);
    if (visaResultData.visa_result_document) {
      formDataToSend.append(
        "visa_result_document",
        visaResultData.visa_result_document
      );
    }

    axios
      .post("/api/embassy/visa-status", formDataToSend)
      .then((res) => {
        console.log("visa status: ", res);
        // toast.success("Visa Result Upload Successfully!");
        toast.success(documentsExist ? "Visa Result updated successfully!" : "Visa Result Upload Successfully!");

        setDocumentsExist(true);
        if (visaResultData.status === "issued") {
          setVisaFormData((prev) => ({
            ...prev,
            visaGranted: true,
            processing: false,
            uploadDeadline: 7, 
            uploadDeadlineExpired: false,
          }));

        } else {
          // Reset visa processing status
          setVisaFormData((prev) => ({
            ...prev,
            visaGranted: false,
            processing: false,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload visa result");
      });
  };

  const reapplyForVisa = () => {
    // Reset the visa processing
    setVisaFormData((prev) => ({
      ...prev,
      daysRemaining: 28,
      processing: true,
      visaGranted: false,
    }));
    toast.success("Visa reapplication initiated!");

    setTimeout(() => {
      const embassyLink = process.env.NEXT_PUBLIC_EMBASSY_LINK;
      if (embassyLink) {
        window.location.href = embassyLink;
      } else {
        console.error("Embassy link is not defined.");
      }
    }, 3000);
  };

  const VisaResultHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("email", visaformData.email);
    if (visaformData.visa_document) {
      formDataToSend.append("visa_document", visaformData.visa_document);
    }

    axios
      .post("/api/embassy/visa-result", formDataToSend)
      .then((res) => {
        console.log("embassy -visa-result ", res);
        toast.success("Visa Upload Successfully!");
        // Update visa status after successful upload
        setVisaFormData((prev) => ({ ...prev, visaGranted: true }));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to upload visa");
      });
  };

  // Helper function to get progress bar variant based on progress
  const getProgressVariant = (progress: number) => {
    if (progress < 40) return "warning";
    if (progress < 80) return "info";
    return "success";
  };
    useEffect(() => {
      const checkExistingDocuments = async () => {
        if (!userId) return;
        
        try {
          const response = await fetch(`/api/embassy/visa-status/get-visa-status?user_id=${userId}`);
          const data = await response.json();
          
          if (data.success && data.documents) {
            setDocumentsExist(true);
            
            // Track which fields have been submitted
            const fields: string[] = [];
            Object.keys(data.documents).forEach(key => {
              if (data.documents[key] && key !== 'user_id' && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                fields.push(key);
              }
            });
          }
        } catch (error) {
          console.error("Error checking documents:", error);
        }
      };
      
      if (userId) {
        checkExistingDocuments();
      }
    }, [userId]);
  return (
    <div>
      <h5 className="section-divider">Upload Appointment Date & Time</h5>

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
        <Col md={3}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">Time</Form.Label>
            <div className="custom-file-upload">
              <input
                type="time"
                name="time"
                id="time"
                value={formData.time}
                onChange={handleTimeChange}
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="form-group">
            <Form.Label className="d-flex align-items-center">Embassy Email</Form.Label>
            <Form.Control
              type="email"
              name="embassy_email"
              id="embassy_email"
              value={embassy_email}
              onChange={handleEmbassyEmailChange}
              placeholder="Enter embassy email"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
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
        <Col md={12} className="align-items-center mt-3">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
            <Button onClick={dateUploadHandler} variant="primary">
              {appointemntStatus ?  "Update" : "Submit"}
            </Button>
          </div>
        </Col>
      </Row>

      <h5 className="section-divider">Upload Embassy Result</h5>

      <Row className="mb-3">
        <Col md={12}>
          <div className="progress-status">
            <div className="d-flex justify-content-between mb-2">
              <span>
                Status:{" "}
                {embassyformData.status.charAt(0).toUpperCase() +
                  embassyformData.status.slice(1)}
              </span>
              <span>{embassyformData.progress}%</span>
            </div>
            <ProgressBar
              now={embassyformData.progress}
              variant={getProgressVariant(embassyformData.progress)}
              animated={embassyformData.status !== "completed"}
            />
          </div>
        </Col>
      </Row>

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
                  <span>{embassyformData.result_document.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="align-items-center">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
            <Button onClick={embassyResultHandler} variant="primary">
              { embassyStatus ? "Update" : "Submit"}
            </Button>
          </div>
        </Col>
      </Row>

      <h5 className="section-divider">Upload Visa Decision Result</h5>

      <Row>
        <Col md={4}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Visa Result Document
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="visa_result_document"
                id="visa_result_document"
                className="file-input"
                accept="application/pdf, image/*"
                onChange={handleVisaResultFileChange}
              />
              <label htmlFor="visa_result_document" className="file-label">
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>

              {visaResultData.visa_result_document && (
                <div className="file-preview">
                  <span>{visaResultData.visa_result_document.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Visa Status</Form.Label>
            <div className="d-flex visa-radio-buttons">
              <Form.Check
                type="radio"
                name="visaStatus"
                id="visaIssued"
                label="Visa Issued"
                className="me-4"
                checked={visaResultData.status === "issued"}
                onChange={() => handleVisaStatusChange("issued")}
              />
              <Form.Check
                type="radio"
                name="visaStatus"
                id="visaRejected"
                label="Visa Rejected"
                checked={visaResultData.status === "rejected"}
                onChange={() => handleVisaStatusChange("rejected")}
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="align-items-center">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
          
            {visaResultData.status === "rejected"  ? <Button
              onClick={visaResultHandler}
              variant="primary"
              disabled
            >
             { (documentsExist ? "Update" : "Submit ")}
            </Button> : <Button
              onClick={visaResultHandler}
              variant="primary"

              disabled={
                !visaResultData.visa_result_document || !visaResultData.status
              }
            >
             { (documentsExist ? "Update" : "Submit ")}
            </Button>}
          </div>
        </Col>
      </Row>

      {visaResultData.status === "rejected" && (
        <Row className="mt-3 mb-3">
          <Col md={12}>
            <div className="visa-rejected-message">
              <Badge bg="danger" className="px-3 py-2 mb-3">
                Your visa application was rejected
              </Badge>
              <Button
                variant="outline-primary"
                className="ms-3"
                onClick={reapplyForVisa}
              >
                Reapply for Visa
              </Button>
            </div>
          </Col>
        </Row>
      )}

      <h5 className="section-divider">Upload Copy of Visa</h5>

      <Row className="mb-3">
        <Col md={12}>
          <div className="visa-status">
            {visaResultData.status === "issued" ? (
              <div className="visa-granted-message">
                <Badge bg="success" className="px-3 py-2 mb-3">
                  Visa Granted! Please upload a copy of your original visa
                </Badge>
                {!visaformData.uploadDeadlineExpired ? (
                  <div className="deadline-warning ms-3">
                    <Badge bg="warning" className="px-3 py-2">
                      <span className="me-2">Time remaining:</span>
                      <strong>{visaformData.uploadDeadline} days</strong>
                    </Badge>
                  </div>
                ) : (
                  <div className="deadline-warning ms-3">
                    <Badge bg="danger" className="px-3 py-2">
                      Deadline expired! Contact support
                    </Badge>
                  </div>
                )}
              </div>
            ) : visaformData.processing ? (
              <>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    Visa Processing: {28 - visaformData.daysRemaining} days
                    elapsed
                  </span>
                  <span>
                    {Math.round(((28 - visaformData.daysRemaining) / 28) * 100)}
                    %
                  </span>
                </div>
                <ProgressBar
                  now={Math.round(
                    ((28 - visaformData.daysRemaining) / 28) * 100
                  )}
                  variant="info"
                  animated={true}
                />
                <div className="mt-2 text-muted">
                  <small>
                    Estimated time remaining: {visaformData.daysRemaining} days.
                    Please wait for visa decision.
                  </small>
                </div>
              </>
            ) : visaResultData.status === "rejected" ? (
              <div className="text-center">
                <span className="text-muted">
                  Reapply for visa to restart the process
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-muted">
                  Please upload your visa decision result first
                </span>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Original Visa Document
            </Form.Label>
            <div className="custom-file-upload">
              <input
                type="file"
                name="visa_document"
                id="visa_document"
                className="file-input"
                accept="application/pdf, image/*"
                onChange={handleVisaFileChange}
                disabled={visaResultData.status !== "issued"}
              />
              <label
                htmlFor="visa_document"
                className={`file-label ${visaResultData.status !== "issued" ? "disabled-upload" : ""}`}
              >
                <IoIosCloudUpload className="upload-icon" />
                <span>Choose File</span>
              </label>

              {visaformData.visa_document && (
                <div className="file-preview">
                  <span>{visaformData.visa_document.name}</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="align-items-center">
          <div className="d-flex align-items-center justify-content-end h-100 w-100">
            <Button
              onClick={VisaResultHandler}
              variant="primary"
              disabled={
                visaResultData.status !== "issued" ||
                !visaformData.visa_document ||
                visaformData.uploadDeadlineExpired
              }
            >
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

        .file-label.disabled-upload {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: #f5f5f5;
        }

        .file-label:hover {
          background-color: rgba(26, 115, 232, 0.1);
          transform: translateY(-2px);
        }

        .disabled-upload:hover {
          transform: none;
          background-color: #f5f5f5;
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

        .progress-status,
        .visa-status {
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .visa-granted-message,
        .visa-rejected-message {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .visa-radio-buttons {
          margin-top: 0.5rem;
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

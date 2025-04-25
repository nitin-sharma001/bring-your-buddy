"use client";
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Container, 
  Button, 
  Row, 
  Col, 
  Form, 
  Alert, 
  Spinner 
} from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FaFileAlt, FaCheck, FaEnvelope, FaCreditCard, FaEye, FaFilePdf } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { MdOutlineFileDownload } from 'react-icons/md';
import axios from 'axios';
import { useUser } from '@/context/userContext';

interface OfferLetter {
  id: string;
  name: string;
  url: string;
  createdAt?: string;
  [key: string]: any;
}

export default function OfferLetterPage() {
  const [loading, setLoading] = useState(false);
  const [hasSubmittedApp, setHasSubmittedApp] = useState(false);
  const [offerLetterGenerated, setOfferLetterGenerated] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([]); 
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    programName: '',
    universityName: '',
    startDate: ''
  });
  const router = useRouter();
  
  const { setOfferLetterStatus } : any = useUser();

  const fetchOfferletter = () => {
    setLoading(true);
    const userData = localStorage.getItem("user");

    if (!userData) {
      toast.error("User data not found");
      setLoading(false);
      return;
    }
    
    const email = JSON.parse(userData).email;

    axios
      .post("/api/offer-letter", { email })
      .then((res) => {
        toast.success("Application submitted successfully!");
        localStorage.setItem("offerletter", "true");
        setOfferLetterGenerated(true);
        
         setOfferLetterStatus(true);
  
        
        axios.post("/api/offer-letter/updatestatus", { email })
          .then((res) => {
            console.log("Offer letter status updated successfully", res);
          })
          .catch((err) => {
            console.error("Error updating offer letter status", err);
          });

        setShowSuccessMessage(true);
        toast("Your Offer Letter will be generated within 1 hour");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error("Error submitting application");
      });
  };

  

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      router.push('/login');
      return;
    }

    const email = JSON.parse(userString).email;

    axios
      .post("/api/application-submitted/get-status", { email })
      .then((res) => {
        console.log("application submitted get Status", res);

        if (res.data.status.application_submitted == 0) {
          setHasSubmittedApp(false);
        } else if (res.data.status.application_submitted == 1) {
          setHasSubmittedApp(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setHasSubmittedApp(false);
      });

      axios
        .post("/api/offer-letter/getStatus", { email })
        .then((res) => {
          console.log("offer letter ", res);

          if (res.data[0].offer_letter_status == 0) {
            setOfferLetterGenerated(false);
          } else if (res.data[0].offer_letter_status == 1) {
            setOfferLetterGenerated(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setOfferLetterGenerated(false);
        });

    if (userString) {
      const userData = JSON.parse(userString);
      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || "",
        address: userData.address || "",
        phoneNumber: userData.phone_number || "",
        programName: localStorage.getItem("program_name") || "Computer Science",
        universityName:
          localStorage.getItem("university_name") || "University of Technology",
        startDate: "September 1, 2023",
      }));
    }

    const fetchOfferLetters = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          console.error("User data not found");
          return;
        }
        
        const { email } = JSON.parse(userData);
        
        const response = await axios.post(
          "/api/offer-letter/getofferletterbyemail",
          { email }
        );
        if (response) {
          if (response.data.offerLetters) {
            setOfferLetters(response.data.offerLetters);
          } else {
            setOfferLetters([]);
          }
        } else {
          setOfferLetters([]);
        }
      } catch (error) {
        console.log("Error fetching offer letters:", error);
      }
    };

    fetchOfferLetters();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateOfferLetter = () => {
    setLoading(true);
    fetchOfferletter();
  };

  const handleDownloadOfferLetter = () => {
    // In a real application, this would download the actual offer letter PDF
    toast('Offer letter download started');
  };

  const handleContinueToPayment = () => {
    router.push('/applications/payment');
  };

  if (!hasSubmittedApp) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Application Required</Alert.Heading>
          <p>
            You need to submit an application before you can generate an offer letter.
            Please go to the Applications page to submit your application first.
          </p>
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-primary" 
              onClick={() => router.push('/applications')}
            >
              Go to Applications
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="page-header mb-4">
        <h4>
          <FaFileAlt className="me-2" />
          Offer Letter Generation
        </h4>
        <p className="text-muted">
          Generate your offer letter to proceed with your application
        </p>
      </div>

      {showSuccessMessage && (
        <Alert 
          variant="success" 
          dismissible 
          onClose={() => setShowSuccessMessage(false)}
        >
          <Alert.Heading>Success!</Alert.Heading>
          <p>
            Your offer letter has been successfully generated. You can download it or proceed to payment.
          </p>
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Generate Offer Letter</h5>
            </Card.Header>
            <Card.Body>
              {offerLetterGenerated ? (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <div className="success-icon-container mx-auto mb-3">
                      <FaCheck className="text-success" size={40} />
                    </div>
                    <h4>Offer Letter Generated!</h4>
                    <p className="text-muted">
                      Your offer letter has been successfully generated. You can download it or proceed to payment.
                    </p>
                  </div>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <Button 
                      variant="primary"
                      onClick={handleContinueToPayment}
                      className="d-flex align-items-center"
                    >
                      Continue to Payment <i className="ms-2 bi bi-arrow-right"></i>
                    </Button>
                  </div>
                </div>
              ) : (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Program</Form.Label>
                        <Form.Control
                          type="text"
                          name="programName"
                          value={formData.programName}
                          onChange={handleInputChange}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>University</Form.Label>
                        <Form.Control
                          type="text"
                          name="universityName"
                          value={formData.universityName}
                          onChange={handleInputChange}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Form.Group>
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleGenerateOfferLetter}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Generating Offer Letter...
                        </>
                      ) : (
                        <>Generate Offer Letter</>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Information</h5>
            </Card.Header>
            <Card.Body>
              <p>The offer letter contains important information about your admission to the program.</p>
              <ul className="info-list">
                <li>Confirmation of your acceptance</li>
                <li>Program details and duration</li>
                <li>Tuition fees and payment information</li>
                <li>Important dates and deadlines</li>
                <li>Required documentation</li>
              </ul>
              <div className="mt-4">
                <p className="text-muted">
                  <small>
                    <FaEnvelope className="me-2" />
                    A copy of your offer letter will also be sent to your registered email address.
                  </small>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Offer Letter Preview Section with iframe */}
      {(offerLetterGenerated || offerLetters.length > 0) && (
        <Card className="shadow-sm mb-4 mt-4">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Offer Letter</h5>
          </Card.Header>
          <Card.Body>
            {offerLetters.length > 0 ? (
              <Row>
                {offerLetters.map((letter, index) => (
                  <Col md={6} lg={4} key={index} className="mb-3">
                    <div className="offer-letter-card">
                      <div className="preview-container">
                        <iframe
                          src={letter.url}
                          className="pdf-preview-iframe"
                          title={letter.name}
                          frameBorder="0"
                        />
                        <div className="preview-overlay"></div>
                      </div>
                      <div className="card-content">
                        <div className="letter-info">
                          <FaFilePdf className="pdf-icon" />
                          <h5 className="letter-title">{letter.name}</h5>
                        </div>
                        <div className="letter-actions">
                          <a
                            href={letter.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button view-btn"
                          >
                            <FaEye /> View
                          </a>
                          <a
                            href={letter.url}
                            download={letter.name}
                            className="action-button download-btn"
                          >
                            <MdOutlineFileDownload /> Download
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No offer letter available yet.</p>
            )}
          </Card.Body>
        </Card>
      )}

      <style jsx global>{`
        .success-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: rgba(40, 167, 69, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .page-header {
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }
        
        .info-list {
          padding-left: 20px;
        }
        
        .info-list li {
          margin-bottom: 0.5rem;
        }
        
        /* New modern card styles */
        .offer-letter-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(225, 230, 245, 0.7);
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          background: #ffffff;
        }
        
        .offer-letter-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(74, 108, 247, 0.15);
          border-color: rgba(74, 108, 247, 0.1);
        }
        
        .preview-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        
        .pdf-preview-iframe {
          width: 100%;
          height: 100%;
          transform: scale(1.01);
          background-color: #f8f9fa;
        }
        
        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom,
            rgba(255, 255, 255, 0) 70%,
            rgba(255, 255, 255, 0.8) 100%);
          pointer-events: none;
        }
        
        .card-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .letter-info {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .pdf-icon {
          font-size: 24px;
          color: #dc3545;
          margin-right: 10px;
        }
        
        .letter-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #2d3748;
        }
        
        .letter-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        
        .action-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          text-decoration: none;
          cursor: pointer;
        }
        
        .view-btn {
          background: linear-gradient(135deg, #4a6cf7, #6e8fff);
          color: white;
          border: none;
        }
        
        .download-btn {
          background: rgba(74, 108, 247, 0.1);
          color: #4a6cf7;
          border: 1px solid rgba(74, 108, 247, 0.3);
        }
        
        .view-btn:hover {
          background: linear-gradient(135deg, #3a5ce6, #5b7df0);
          transform: translateY(-2px);
        }
        
        .download-btn:hover {
          background: rgba(74, 108, 247, 0.15);
          transform: translateY(-2px);
        }
      `}</style>
    </Container>
  );
} 
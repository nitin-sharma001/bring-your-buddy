"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Card, 
  Badge, 
  Row, 
  Col, 
  Table, 
  ProgressBar, 
  Button,
  Spinner,
  Alert 
} from 'react-bootstrap';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUniversity, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaFileAlt,
  FaArrowRight
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';

interface University {
  id: string;
  name: string;
  [key: string]: any;
}

interface Program {
  id: string;
  name: string;
  [key: string]: any;
}

interface User {
  email?: string;
  program_id?: string;
  university_id?: string;
  [key: string]: any;
}
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Page = () => {
    const [user, setUser] = useState<User>({});
    const [program, setProgram] = useState<Program | null>(null);
    const [university, setUniversity] = useState<University | null>(null);
    const [dverified, setDverified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [offerLetterGenerated, setOfferLetterGenerated] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const router = useRouter();

    // Default enrollment date and fees
    const [startDate, setStartDate] = useState('September 1, 2023');
    const [fees, setFees] = useState(100);


    useEffect(() => {
        setLoading(true);


              const email = JSON.parse(localStorage.getItem("user")).email;


              axios
                .post("/api/documentverify/getStatus", { email })
                .then((res) => {
                  console.log("documentverify : ", res);
                  console.log(
                    "res.data.status.document_verified_status  :",
                    res.data.status.document_verified_status
                  );

                  if (res.data.status.document_verified_status === 1) {
                    setDverified(true);
                  } else if (res.data.status.document_verified_status === 0) {
                    setDverified(false);
                    // getUserCertificatesInfo();
                  }
                })
                .catch((err) => {
                  console.log("documentverify : ", err);
                });


      
        
        axios
              .post("/api/application-submitted/get-status", { email })
              .then((res) => {
                console.log("application submitted get Status", res);
        
                if (res.data.status.application_submitted == 0) {
                  setApplicationSubmitted(false);
                } else if (res.data.status.application_submitted == 1) {
                  setApplicationSubmitted(true);
                }
              })
              .catch((err) => {
                console.log(err);
                setApplicationSubmitted(false);
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
        axios
          .post("/api/payment/getpaymentinfo", { email })
          .then((res) => {
            console.log(" getpaymentinfo", res);

            if (res.data.data.payment_status == 0) {
              setPaymentCompleted(false);
            } else if (res.data.data.payment_status == 1) {
              setPaymentCompleted(true);
            }
          })
          .catch((err) => {
            console.log(err);
            setPaymentCompleted(false);
          });
        
        const userString = localStorage.getItem("user");
        if (!userString) {
            setLoading(false);
            return;
        }

        try {
            const userData = JSON.parse(userString);
            const email = userData?.email;
            
            if (!email) {
                setLoading(false);
                return;
            }
        
            const getUserDetails = async () => {
                try {
                    const userResponse = await axios.post("/api/getuserbyemail", { email });
                    const userData = userResponse.data.user;
                    setUser(userData);
                    
                    if (userData?.program_id) {
                        try {
                            const programResponse = await axios.post(
                                "/api/programs/getprogrambyid", 
                                { id: userData.program_id }
                            );
                            setProgram(programResponse.data.program);
                            localStorage.setItem('program_name', programResponse.data.program.name);
                        } catch (err) {
                            console.error("Error fetching program:", err);
                        }
                    }
                    
                    if (userData?.university_id) {
                        try {
                            const universityResponse = await axios.post(
                                "/api/universities/getuniversitybyid", 
                                { id: userData.university_id }
                            );
                            setUniversity(universityResponse.data.university);
                            localStorage.setItem('university_name', universityResponse.data.university.name);
                        } catch (err) {
                            console.error("Error fetching university:", err);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching user:", err);
                } finally {
                    setLoading(false);
                }
        };

        getUserDetails();
        } catch (err) {
            console.error("Error parsing user data:", err);
            setLoading(false);
        }
    }, []);

    const handleSubmitApplication = () => {
      setLoading(true);

      const email = JSON.parse(localStorage.getItem("user")).email;

      axios
        .post("/api/application-submitted", { email })
        .then((res) => {
          console.log("application_submitted", res.data);

          localStorage.setItem("application_submitted", "true");

          setApplicationSubmitted(true);
          setShowSuccessMessage(true);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
        
        
    };
    
    const handleNextStep = () => {
        router.push('/applications/offerletter');
    };

  return (
    <div className="">
      <div className="application-header">
        <div className="header-title-section">
          <div className="header-icon">
            <FaFileAlt />
          </div>
          <div className="header-text">
            <h4>Application Status</h4>
            <p className="header-subtitle">Manage your application details</p>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <Alert
          variant="success"
          className="mx-3 my-3"
          dismissible
          onClose={() => setShowSuccessMessage(false)}
        >
          <Alert.Heading>Application Submitted!</Alert.Heading>
          <p>
            Your application has been successfully submitted. You can now
            proceed to generate your offer letter.
          </p>
          <div className="d-flex justify-content-end d-flex align-items-center justify-content-center">
            <Button
              variant="outline-success  d-flex align-items-center "
              onClick={handleNextStep}
            >
              Generate Offer Letter <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading your application details...</p>
        </div>
      ) : (
        <div className="content-card-body">
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="shadow-sm h-100 status-card">
                <Card.Header className="d-flex justify-content-between align-items-center bg-gradient-primary text-white">
                  <h5 className="mb-0">Application Details</h5>
                  <Badge
                    bg={dverified ? "success" : "warning"}
                    className="status-badge"
                  >
                    {dverified ? "Verified" : "Pending Verification"}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Table responsive className="application-details-table">
                    <tbody>
                      <tr>
                        <td className="text-muted w-100 d-flex align-items-center gap-2">
                          <FaUniversity className="" /> University
                        </td>
                        <td className="value">
                          {university?.name || "Not specified"}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted w-100 d-flex align-items-center gap-2">
                          <FaGraduationCap className="" /> Program
                        </td>
                        <td className="value">
                          {program?.name || "Not specified"}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted w-100 d-flex align-items-center gap-2">
                          <FaCalendarAlt className="" /> Start Date
                        </td>
                        <td className="value">{startDate}</td>
                      </tr>
                      <tr>
                        <td className="text-muted w-100 d-flex align-items-center gap-2">
                          <FaMoneyBillWave className="" /> Fees
                        </td>
                        <td className="value">₹{fees}</td>
                      </tr>
                      <tr>
                        <td className="text-muted w-100 d-flex align-items-center gap-2">
                          <FaFileAlt className="" /> Document Status
                        </td>
                        <td className="value">
                          {dverified ? (
                            <span className="text-success w-100 d-flex align-items-center">
                              <FaCheckCircle className="me-2" /> Documents
                              Verified
                            </span>
                          ) : (
                            <span className="text-warning w-100 d-flex align-items-center">
                              <FaTimesCircle className="me-2" /> Pending
                              Verification
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  {!applicationSubmitted && (
                    <div className="text-center mt-4">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleSubmitApplication}
                        disabled={loading || !dverified}
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
                            Submitting...
                          </>
                        ) : (
                          <>Submit Application</>
                        )}
                      </Button>
                      {!dverified && (
                        <p className="text-danger mt-2">
                          <small>
                            Your documents need to be verified before submitting
                          </small>
                        </p>
                      )}
                    </div>
                  )}

                  {applicationSubmitted && !offerLetterGenerated && (
                    <div className="text-center mt-4 d-flex align-items-center justify-content-center">
                      <Button
                        variant="success d-flex align-items-center"
                        onClick={handleNextStep}
                      >
                        Generate Offer Letter <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  )}

                  {offerLetterGenerated && !paymentCompleted && (
                    <div className="text-center mt-4 d-flex align-items-center justify-content-center">
                      <Button
                        className="d-flex  align-items-center"
                        variant="success"
                        onClick={() => router.push("/applications/payment")}
                      >
                        Continue to Payment <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  )}

                  {paymentCompleted && (
                    <div className="text-center mt-4">
                      <Alert variant="success">
                        <FaCheckCircle className="me-2" />
                        Your application process is complete. Thank you!
                      </Alert>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-gradient-success text-white">
                  <h5 className="mb-0">Application Progress</h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <div className="progress-item mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>Document Verification</span>
                      <span>{dverified ? "100%" : "50%"}</span>
                    </div>
                    <ProgressBar
                      variant={dverified ? "success" : "warning"}
                      now={dverified ? 100 : 50}
                      className="custom-progress"
                    />
                  </div>

                  <div className="progress-item mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>Application Submission</span>
                      <span>{applicationSubmitted ? "100%" : "0%"}</span>
                    </div>
                    <ProgressBar
                      variant={applicationSubmitted ? "success" : "info"}
                      now={applicationSubmitted ? 100 : 0}
                      className="custom-progress"
                    />
                  </div>

                  <div className="progress-item mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>Offer Letter</span>
                      <span>{offerLetterGenerated ? "100%" : "0%"}</span>
                    </div>
                    <ProgressBar
                      variant={offerLetterGenerated ? "success" : "info"}
                      now={offerLetterGenerated ? 100 : 0}
                      className="custom-progress"
                    />
                  </div>

                  <div className="progress-item mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span>Payment</span>
                      <span>{paymentCompleted ? "100%" : "0%"}</span>
                    </div>
                    <ProgressBar
                      variant={paymentCompleted ? "success" : "info"}
                      now={paymentCompleted ? 100 : 0}
                      className="custom-progress"
                    />
                  </div>

                  <div className="application-steps mt-4">
                    <h6 className="mb-3">Application Steps</h6>
                    <div className="step-item d-flex align-items-start mb-3">
                      <div
                        className={`step-number ${dverified ? "completed" : "in-progress"}`}
                      >
                        1
                      </div>
                      <div className="step-info ms-3">
                        <h6 className="mb-1">Document Verification</h6>
                        <p className="text-muted small mb-0">
                          {dverified
                            ? "Documents verified successfully"
                            : "Your documents are being verified"}
                        </p>
                      </div>
                    </div>

                    <div className="step-item d-flex align-items-start mb-3">
                      <div
                        className={`step-number ${applicationSubmitted ? "completed" : dverified ? "in-progress" : "pending"}`}
                      >
                        2
                      </div>
                      <div className="step-info ms-3">
                        <h6 className="mb-1">Submit Application</h6>
                        <p className="text-muted small mb-0">
                          {applicationSubmitted
                            ? "Application submitted successfully"
                            : dverified
                              ? "Ready to submit"
                              : "Waiting for document verification"}
                        </p>
                      </div>
                    </div>

                    <div className="step-item d-flex align-items-start mb-3">
                      <div
                        className={`step-number ${offerLetterGenerated ? "completed" : applicationSubmitted ? "in-progress" : "pending"}`}
                      >
                        3
                      </div>
                      <div className="step-info ms-3">
                        <h6 className="mb-1">Generate Offer Letter</h6>
                        <p className="text-muted small mb-0">
                          {offerLetterGenerated
                            ? "Offer letter generated successfully"
                            : applicationSubmitted
                              ? "Ready to generate"
                              : "Waiting for application submission"}
                        </p>
                      </div>
                    </div>

                    <div className="step-item d-flex align-items-start">
                      <div
                        className={`step-number ${paymentCompleted ? "completed" : offerLetterGenerated ? "in-progress" : "pending"}`}
                      >
                        4
                      </div>
                      <div className="step-info ms-3">
                        <h6 className="mb-1">Complete Payment</h6>
                        <p className="text-muted small mb-0">
                          {paymentCompleted
                            ? "Payment completed successfully"
                            : offerLetterGenerated
                              ? "Ready for payment"
                              : "Waiting for offer letter"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      <style jsx global>{`
        .custom-progress {
          height: 10px;
          border-radius: 5px;
        }

        .status-badge {
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .header-title-section {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4a56e2, #7b68ee);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          margin-right: 16px;
        }

        .header-subtitle {
          color: #718096;
          margin-bottom: 0;
        }

        .application-details-table td.text-muted {
          width: 35%;
        }

        .application-details-table td.value {
          font-weight: 500;
        }

        .property-icon {
          color: #4a56e2;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }

        .step-number.completed {
          background-color: #28a745;
        }

        .step-number.in-progress {
          background-color: #007bff;
        }

        .step-number.pending {
          background-color: #6c757d;
        }

        .step-info h6 {
          font-size: 14px;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

export default Page

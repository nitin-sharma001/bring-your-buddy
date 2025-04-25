"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {FaRegClock, FaGraduationCap } from "react-icons/fa6";
import {
  FaFileAlt,
  FaCheckCircle,
  FaUniversity,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { Button, Card, Badge, ProgressBar } from "react-bootstrap";


import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Table, Container, Spinner, Alert } from "react-bootstrap";
import { useUser } from "@/context/userContext";

interface OfferLetter {
  name: string;
  url: string;
}

export default function Dashboard() {
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([]);
  const [documents, setDocuments] = useState<OfferLetter[]>([]);
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [user, setUser] = useState({});
  const [program, setProgram] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [thumbnails, setThumbnails] = useState({});
  const [document_verified, setDocumentVerfied] = useState(false);

  const [elgible, setEligible] = useState(false);


  const {
    application_submitted_status,
    setAppSubmitted,
    offer_letter_status,
    setOfferLetterStatus,
    payent_completed_status,
    setPaymentCompletedStatus,
    doc_verification_status,
    setDocVerification,
  } :any= useUser();



  useEffect(() => {
    setLoading(true);
    const email = JSON.parse(localStorage.getItem("user"))?.email;
    if (!email) {
      router.push("/login");
      return;
    }

    axios
      .post("/api/documentverify/iseligible/getStatus", { email })
      .then((res) => {
        console.log("is eligible : ", res.data);
        if (res.data.status.is_eligible == 1) {
          setEligible(true);
        } else {
          setEligible(false);
        }
      });

    const detectStream = async (userResponse, response) => {
      console.log(
        "before detecting data : ",
        email,
        userResponse.data.user.program_id
      );

      axios
        .post("/api/documentverify/detect-stream", {
          email: email,
          program_id: userResponse.data.user.program_id,
          text: response.data.twelfth_certificate.text,
        })
        .then((res) => {
          console.log("detect hua ya nahi", res.data);

          if (res.data.isValid) {
            toast.success("You are Eligible for that program !");

            axios
              .post("/api/documentverify/iseligible", { email })
              .then((res) => {
                console.log("is elgible : ", res.data);
                if (res.data.success == true) {
                  setEligible(true);
                } else {
                  setEligible(false);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }else{
            toast.error("You are Not Eligible for that program !");
            setEligible(false);
          }
        });
    };

    const getUserCertificatesInfo = async () => {
      const userResponse = await axios.post("/api/getuserbyemail", { email });

      if (userResponse.data.user.bachelor_certificate != null) {
        try {
          axios
            .post("/api/scan-documents/bachelor-scan", { email })
            .then((res) => {
              console.log("bachelor scan hua ya nahi", res.data);

              if(res.data.bachelor_certificate.isBachelorCertificate == true){
                toast.success("Your Bachelor Certificate is verified successfully");
                localStorage.setItem("document_verified", "1");
                const id = JSON.parse(localStorage.getItem("user")).id;

                axios.post("/api/documentverify", { id }).then((res) => {
                  console.log("bachleor document verify", res);

                  setDocumentVerfied(true);
                  
                  elgible && toast.success(
                    "Your all documents Successfully verified !"
                  );
                }).catch((err) => {console.log(err);
                })
                axios
                  .post("/api/documentverify/iseligible", { email })
                  .then((res) => {
                    console.log("is elgible : ", res.data);
                    if (res.data.success == true) {
                      setEligible(true);
                    } else {
                      setEligible(false);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            });
        } catch (err) {
          console.log(err);
        }
      } else if (userResponse.data.user.bachelor_certificate == null) {
        try {
          const response = await axios.post("/api/scan-documents", {
            email,
          });

          const id = JSON.parse(localStorage.getItem("user")).id;

          if (
            response.data.tenth_certificate.isMarksheet &&
            response.data.tenth_certificate.text !== "" &&
            response.data.twelfth_certificate.isMarksheet &&
            response.data.twelfth_certificate.text !== ""
          ) {
            axios.post("/api/documentverify", { id }).then((res) => {
              console.log("hua ya nahi documentverify", res);

              setDocumentVerfied(true);
              elgible && toast.success(
                "Your all documents Successfully verified !"
              );
            });

            console.log("response.data before detecting", response.data);

            detectStream(userResponse, response);
          } else if (
            response.data.tenth_certificate.isMarksheet &&
            response.data.tenth_certificate.text !== ""
          ) {
            elgible && toast.success(
              "Your 10th Certificate is verified successfully"
            );
            localStorage.setItem("document_verified", "1");
          } else if (
            response.data.tenth_certificate.isMarksheet &&
            response.data.tenth_certificate.text == ""
          ) {
            toast.error("Please upload your 10th Certificate quality document");
            localStorage.setItem("document_verified", "0");
          } else {
            toast.error(
              "Please upload your 10th Certificate original document"
            );
            localStorage.setItem("document_verified", "0");
          }

          if (
            response.data.twelfth_certificate.isMarksheet &&
            response.data.twelfth_certificate.text !== ""
          ) {
            elgible &&
               toast.success("Your 12th Certificate is verified successfully");
            localStorage.setItem("document_verified", "1");
          } else if (
            response.data.twelfth_certificate.isMarksheet &&
            response.data.twelfth_certificate.text == ""
          ) {
            toast.error("Please upload your 12th Certificate quality document");
            localStorage.setItem("document_verified", "0");
          } else {
            toast.error(
              "Please upload your 12th Certificate original document"
            );
            localStorage.setItem("document_verified", "0");
          }
        } catch (error) {
          console.error("Error verifying documents:", error);
        }
      }
    };

    axios
      .post("/api/documentverify/getStatus", { email })
      .then((res) => {
        console.log("documentverify : ", res);
        console.log(
          "res.data.status.document_verified_status  :",
          res.data.status.document_verified_status
        ); 

        if (res.data.status.document_verified_status === 1) {
          setDocumentVerfied(true);
          setDocVerification(true);
        } else if (res.data.status.document_verified_status === 0) {
          setDocumentVerfied(false);
          setDocVerification(false);

          getUserCertificatesInfo();
        }
      })
      .catch((err) => {
        console.log("documentverify : ", err);
      });

    const getUserDetails = () => {
      axios
        .post("/api/getuserbyemail", { email })
        .then((res) => {
          setUser(res.data.user);
          console.log("res.data.user) : ", res.data.user);

          const program_id = res.data.user.program_id;
          const university_id = res.data.user.university_id;

          axios
            .post("/api/programs/getprogrambyid", { id: program_id })
            .then((res) => {
              setProgram(res.data.program);
            })
            .catch((err) => {
              console.log(err);
            });

          axios
            .post("/api/universities/getuniversitybyid", { id: university_id })
            .then((res) => {
              setUniversity(res.data.university);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const fetchOfferLetters = async () => {
      try {
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

    const fetchDocuments = async () => {
      try {
        const response = await axios.post(
          "/api/send-documents/getdocumentsbyemail",
          { email }
        );

        if (response.data.documents) {
          setDocuments(response.data.documents);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();

    const getPaymentInfo = async () => {
      try {
        const response = await axios.post("/api/payment/getpaymentinfo", {
          email,
        });

        if (response.data.data.payment_status == 1) {
          setPaymentStatus(response.data.data.payment_status);
        }
      } catch (error) {
        console.error("Error fetching payment info:", error);
      }
    };

    const getReminders = () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      axios
        .post("/api/appointment-notification/getreminder", { id })
        .then((res) => {
          const { appointment_date, appointment_time } = res.data.reminders;

          const date = new Date(appointment_date);

          const [hours, minutes] = appointment_time.split(":").map(Number);

          date.setHours(hours);
          date.setMinutes(minutes);
          date.setSeconds(0);

          const formattedDate = new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          }).format(date);

          toast.success(
            `Your appointment at the Indian Embassy is on: ${formattedDate}`,
            {
              position: "top-right",
              duration: 15000,
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getUserDetails();
    fetchDocuments();
    getPaymentInfo();

    getReminders();
    setLoading(false);
  }, [router]);

  const [dverified, setDverified] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [offerLetterGenerated, setOfferLetterGenerated] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  const [startDate, setStartDate] = useState("September 1, 2023");
  const [fees, setFees] = useState(100);

  useEffect(() => {
    setLoading(true);
    if (document_verified == true) {
      setDverified(true);
    } else {
      setDverified(false);
    }

    // const offerGenerated = localStorage.getItem("offerletter") === "true";

    const email = JSON.parse(localStorage.getItem("user")).email;

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
        console.log("offer letter hai ya nahi", res);

        if (res.data[0].offer_letter_status == 0) {
          setOfferLetterGenerated(false);
        } else if (res.data[0].offer_letter_status == 1) {
          setOfferLetterGenerated(true);
        }
      })
      .catch((err) => {
        console.log(err);
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
          const userResponse = await axios.post("/api/getuserbyemail", {
            email,
          });
          const userData = userResponse.data.user;
          setUser(userData);

          if (userData?.program_id) {
            try {
              const programResponse = await axios.post(
                "/api/programs/getprogrambyid",
                { id: userData.program_id }
              );
              setProgram(programResponse.data.program);
              localStorage.setItem(
                "program_name",
                programResponse.data.program.name
              );
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
              localStorage.setItem(
                "university_name",
                universityResponse.data.university.name
              );
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
        setAppSubmitted(true);
        setAppSubmitted(true);
        setShowSuccessMessage(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNextStep = () => {
    router.push("/applications/offerletter");
  };

  return (
    <div className="dashboard-content p-4">
      <div className="welcome-banner mb-5">
        <div className="welcome-content">
          <h2 className="fade-in">Welcome to Your Dashboard</h2>
          <p className="slide-in-right delay-1">
            Manage your applications, documents, and track your progress
          </p>
          {/* {paymentStatus === 0 && offerLetters.length > 0 && (
            <div className="welcome-action slide-in-left delay-2">
              <Button
                variant="primary"
                className="btn-primary pulse-animation"
                onClick={() => router.push("/payment")}
              >
                <FaCreditCard className="me-2" /> Make Payment
              </Button>
            </div>
          )} */}
        </div>
      </div>

      <div className="stats-cards mb-5">
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card fade-in">
              <div className="stat-card-body">
                <div className="stat-icon blue">
                  <FaUniversity />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{university?.name || "N/A"}</h3>
                  <p className="stat-title">Selected University</p>
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-growth positive">
                  <i className="fas fa-arrow-up"></i> Excellent Choice
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card fade-in delay-1">
              <div className="stat-card-body">
                <div className="stat-icon red">
                  <FaGraduationCap />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{program?.name || "N/A"}</h3>
                  <p className="stat-title">Selected Program</p>
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-growth positive">
                  <i className="fas fa-arrow-up"></i> Great Selection
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card fade-in delay-2">
              <div className="stat-card-body">
                <div className="stat-icon green">
                  <FaFileAlt />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{documents.length}</h3>
                  <p className="stat-title">Documents</p>
                </div>
              </div>
              <div className="stat-footer">
                <span className="stat-growth positive">
                  <i className="fas fa-check"></i>{" "}
                  {document_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card fade-in delay-3">
              <div className="stat-card-body">
                <div className="stat-icon yellow">
                  <FaRegClock />
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">
                    {paymentStatus === 1 ? "Paid" : "Pending"}
                  </h3>
                  <p className="stat-title">Payment Status</p>
                </div>
              </div>
              <div className="stat-footer">
                <span
                  className={`stat-growth ${paymentStatus === 1 ? "positive" : "negative"}`}
                >
                  <i
                    className={`fas fa-${paymentStatus === 1 ? "check" : "clock"}`}
                  ></i>{" "}
                  {paymentStatus === 1 ? "Completed" : "Action Required"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

        {/* {showSuccessMessage && (
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
        )} */}

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
                      {document_verified ? "Verified" : "Pending Verification"}
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
                            {document_verified ? (
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
                        {elgible ? (
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSubmitApplication}
                            disabled={loading || !document_verified}
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
                        ) : (
                          <p>
                            You are Not eligible for that particular program.
                            Please Update your Profile.
                          </p>
                        )}
                        {!document_verified && (
                          <p className="text-danger mt-2">
                            <small>
                              Your documents need to be verified before
                              submitting
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
                          Generate Offer Letter{" "}
                          <FaArrowRight className="ms-2" />
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
                        <span>{document_verified ? "100%" : "50%"}</span>
                      </div>
                      <ProgressBar
                        variant={document_verified ? "success" : "warning"}
                        now={document_verified ? 100 : 50}
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

                    <div className="aplplication-steps mt-4">
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
      </div>
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

      <style jsx global>{`
        .document-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .document-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .document-thumbnail {
          height: 200px;
          background-size: cover;
          background-position: top center;
          border-bottom: 1px solid #f0f0f0;
        }

        .document-details {
          padding: 16px;
        }

        .document-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .document-status {
          margin-bottom: 15px;
        }

        .document-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: var(--primary-light);
          color: white;
        }

        .empty-state,
        .payment-required {
          padding: 40px 20px;
        }

        .university-program-info {
          max-width: 400px;
          margin: 0 auto;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
        }

        .selected-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }

        .label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .value {
          font-weight: 600;
          color: var(--secondary);
        }
      `}</style>
    </div>
  );
}

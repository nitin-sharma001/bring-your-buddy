"use client";

import axios from "axios";
import Script from "next/script";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Table,
} from "react-bootstrap";
import {
  FaArrowRight,
  FaCheckCircle,
  FaMoneyBillWave,
  FaDownload,
  FaCheck,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { getUserProperty } from "@/utils/localStorage";



declare global {
  interface Window {
    Razorpay: any;
  }
}



export default function PaymentPage() {
  const Amount = 100 * 100;
  const formattedAmount = (Amount / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  // const [user, setUser] = useState<any>({});
  const [hasOfferLetter, setHasOfferLetter] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [offerLetterData, setOfferLetterData] = useState({
    fullName: "",
    programName: "",
    universityName: "",
    startDate: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [program_name, setProgramName] = useState("");
  const [university_name, setUniversityName] = useState("");


  
    const {
            setAppSubmitted,
            setOfferLetterStatus,
            setPaymentCompletedStatus,application_submitted_status,offer_letter_status,payent_completed_status
          } : any = useUser();

  useEffect(() => {
    setLoading(true);
    
    const email = getUserProperty<any, 'email'>('email');
    if (!email) {
      toast.error("User email not found");
      setLoading(false);
      return;
    }

    axios
      .post("/api/offer-letter/getStatus", { email })
      .then((res) => {
        console.log("offer letter ", res);

        if (res.data[0].offer_letter_status == 0) {
          setHasOfferLetter(false);
        } else if (res.data[0].offer_letter_status == 1) {
          setHasOfferLetter(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setHasOfferLetter(false);
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

    const offerDataString = localStorage.getItem("offer_letter_data");
    if (offerDataString) {
      try {
        const offerData = JSON.parse(offerDataString);
        setOfferLetterData(offerData);
      } catch (error) {
        console.error("Error parsing offer letter data:", error);
      }
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);

    const program_name1 = localStorage.getItem("program_name") || "";
    setProgramName(program_name1);

    const university_name1 = localStorage.getItem("university_name") || "";
    setUniversityName(university_name1);
  }, []);

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/dashboard");
  };

  const applicationFee = 5000;
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      if (!user) {
        toast.error("User information not found");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Amount,
        currency: "INR",
        name: "Bring Your Buddy",
        description: "University Application Fee",
        prefill: {
          name: user?.name || "",
          email: user.email || "",
          contact: user.phone_number || "",
        },
        theme: {
          color: "#FB0200",
        },
        modal: {
          confirm_close: true,
        },
        handler: function (response: any) {
          handlePaymentSuccess(response);
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        console.log(response.error);
      });

      rzp1.open();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (response : any) => {
    axios
      .post("/api/payment", { email: user.email })
      .then((res) => {
        console.log("Payment status updated successfully:", res.data);

        axios
          .post("/api/send-documents", {
            email: user.email,
            name: user?.name,
            paymentConfirmation: response.razorpay_payment_id,
            amount: Amount,
          })
          .then((res) => {
            toast.success(
              "Payment successful! You can now check your email for further details."
            );

            setPaymentCompletedStatus(true);
          

            localStorage.setItem("payment_completed", "true");
            setPaymentCompleted(true);
            setShowSuccessModal(true);
            setProcessingPayment(false);
          })
          .catch((err) => {
            console.log("err : ", err);
            toast.error(
              "Payment processed but document generation failed. Please contact support."
            );
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Payment processing failed. Please contact support.");
      });
  };

  return (
    <div className="auth-container payment-page pt-5">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Container className="py-4">
        <div className="page-header mb-4">
          <h4>
            <FaMoneyBillWave className="me-2" />
            Application Payment
          </h4>
          <p className="text-muted">
            Complete your application process by paying the application fee
          </p>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Payment Details</h5>
              </Card.Header>
              <Card.Body>
                {paymentCompleted ? (
                  <div className="text-center py-4">
                    <div className="mb-4">
                      <div className="success-icon-container mx-auto mb-3">
                        <FaCheck className="text-success" size={40} />
                      </div>
                      <h4>Payment Completed!</h4>
                      <p className="text-muted">
                        Your payment has been successfully processed. Your
                        application is now complete.
                      </p>
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                      <Button
                        variant="outline-primary"
                        // onClick={handleDownloadOfferLetter}
                        className="d-flex align-items-center"
                      >
                        <FaDownload className="me-2" /> Download Receipt
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => router.push("/dashboard")}
                        className="d-flex align-items-center"
                      >
                        Go to Dashboard <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="offer-summary mb-4">
                      <h5 className="mb-3">Offer Letter Summary</h5>
                      <Table bordered hover responsive className="offer-table">
                        <tbody>
                          <tr>
                            <th>Name</th>
                            <td>
                              {offerLetterData.fullName ||
                                user?.name ||
                                "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <th>Program</th>
                            <td>{program_name || "Not specified"}</td>
                          </tr>
                          <tr>
                            <th>University</th>
                            <td>{university_name || "Not specified"}</td>
                          </tr>
                          <tr>
                            <th>Start Date</th>
                            <td>{"03-04-2025"}</td>
                          </tr>
                          <tr>
                            <th>Application Fee</th>
                            <td className="fw-bold">₹{applicationFee}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <hr className="my-4" />

                    <div className="payment-methods mb-4">
                      <Form>
                        <div className="d-grid gap-2 mt-4">
                          <Button
                            variant="primary"
                            className="w-100 pay-now-btn"
                            onClick={handlePayment}
                            disabled={isProcessing || !user}
                          >
                            {isProcessing ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Processing...
                              </>
                            ) : (
                              <div className="d-flex align-items-center justify-content-center">
                                Pay Now <FaArrowRight className="ms-2" />
                              </div>
                            )}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Payment Information</h5>
              </Card.Header>
              <Card.Body>
                <p>
                  The application fee covers the processing of your application
                  and is non-refundable.
                </p>
                <ul className="info-list">
                  <li>Application processing fee</li>
                  <li>Document verification</li>
                  <li>Administrative charges</li>
                  <li>Communication expenses</li>
                </ul>
                <div className="mt-4 payment-security-note">
                  <p className="text-muted">
                    <small>
                      {/* <FaLock className="me-2" /> */}
                      All payment information is securely processed. We do not
                      store your credit card details.
                    </small>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Success Modal */}
        <Modal
          show={showSuccessModal}
          onHide={closeSuccessModal}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Application Complete!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className="success-icon-container mx-auto mb-3">
              <FaCheckCircle className="text-success" size={50} />
            </div>
            <h4>Thank You!</h4>
            <p>
              Your application has been successfully submitted and payment has
              been processed. You will receive a confirmation email shortly with
              further instructions.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={closeSuccessModal}>
              Go to Dashboard
            </Button>
          </Modal.Footer>
        </Modal>

        <style jsx global>{`
          .success-icon-container {
            width: 100px;
            height: 100px;
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

          .payment-features {
            padding-left: 20px;
            margin-top: 10px;
          }

          .offer-table th {
            width: 30%;
            background-color: #f8f9fa;
          }

          .bank-details-table th {
            width: 40%;
            background-color: #f8f9fa;
          }

          .payment-method-radio {
            border: 1px solid #dee2e6;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .payment-method-radio:hover {
            background-color: #f8f9fa;
          }
        `}</style>
      </Container>
    </div>
  );
}

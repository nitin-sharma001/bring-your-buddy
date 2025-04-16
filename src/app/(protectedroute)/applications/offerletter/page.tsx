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
import { FaFileAlt, FaCheck, FaEnvelope, FaCreditCard, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { MdOutlineFileDownload } from 'react-icons/md';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Define the OfferLetter interface
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
  
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    if (offerLetters[0]?.url) {
      generateThumbnail(offerLetters[0]?.url);
    }
  }, [offerLetters]);

  const generateThumbnail = async (pdfUrl: string) => {
    try {
      // Import pdfjs dynamically in the browser
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set the worker source
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
  
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
  
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (!context) {
        throw new Error("Could not get canvas context");
      }
  
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      const renderContext = { canvasContext: context, viewport };
      await page.render(renderContext).promise;
  
      setThumbnail(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error generating PDF thumbnail:", error);
    }
  };
  
  const generateThumbnails = async (pdfUrl: string) => {
    try {
      // Import pdfjs dynamically in the browser
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set the worker source
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
  
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
  
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (!context) {
        throw new Error("Could not get canvas context");
      }
  
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      const renderContext = { canvasContext: context, viewport };
      await page.render(renderContext).promise;
  
      setThumbnails((prev) => ({
        ...prev,
        [pdfUrl]: canvas.toDataURL("image/png"),
      }));
    } catch (error) {
      console.error("Error generating PDF thumbnail:", error);
    }
  };

  // Add back the fetchOfferletter function
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

    const email = JSON.parse(localStorage.getItem("user")).email;

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



    // Populate form data from local storage
    const userString = localStorage.getItem("user");
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
                  
                  {/* <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                   */}
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

      {/* Offer Letter Preview Section */}
      {(offerLetterGenerated || offerLetters.length > 0) && (
        <Card className="shadow-sm mb-4 mt-4">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Offer Letter</h5>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={handleDownloadOfferLetter}
              >
                <MdOutlineFileDownload className="me-1" /> Download
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => window.open(offerLetters[0]?.url, '_blank')}
              >
                <FaEye className="me-1" /> View Full
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {thumbnail ? (
              <div className="pdf-thumbnail-container">
                <img 
                  src={thumbnail} 
                  alt="Offer Letter Preview" 
                  className="pdf-thumbnail img-fluid" 
                  onClick={() => window.open(offerLetters[0]?.url, '_blank')}
                />
              </div>
            ) : (
              <div className="text-center py-5">
                <FaFileAlt size={48} className="text-muted mb-3" />
                <p>Your offer letter is ready. You can see within 1 hour</p>
              </div>
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
        
        .pdf-thumbnail-container {
          display: flex;
          justify-content: center;
          background-color: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          cursor: pointer;
        }
        
        .pdf-thumbnail {
          max-height: 500px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        
        .pdf-thumbnail:hover {
          transform: scale(1.02);
        }
      `}</style>
    </Container>
  );
} 
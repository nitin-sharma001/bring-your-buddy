"use client";

import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Form, Row, Card, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { IoIosCloudUpload } from 'react-icons/io';

const Page = () => {

    const [formData, setFormData] = useState({
        user_id: "",
        offer_letter: null,
        offer_letter_school: null,
        admission_letter: null,
        bonafide_certificate: null,
        student_undertaking_form: null,
        photograph: null,
        parent_affidavit: null,
        proof_of_residence: null, 
        receipt_of_paid_fees: null,
        itinerary_ticket: null,
        bank_statement: null,
        bank_statement_owner_id: null,
        passport_copy: null,
        educational_certificates: null,
        id_copy: null,
    });

    const [student_undertaking, setStudentUndertaking] = useState(null);
    const [bonafide_certificat, setBonafidecertificate] = useState(null);
    const [admission_lette, setAdmissionLetter] = useState(null);
    const [offer_lette, setOfferLetter] = useState(null);
    
    // Preview states for new fields
    const [photograph, setPhotograph] = useState(null);
    const [offer_letter_school, setOfferLetterSchool] = useState(null);
    const [parent_affidavit, setParentAffidavit] = useState(null);
    const [proof_of_residence, setProofOfResidence] = useState(null);
    const [receipt_of_paid_fees, setReceiptOfPaidFees] = useState(null);
    const [itinerary_ticket, setItineraryTicket] = useState(null);
    const [bank_statement, setBankStatement] = useState(null);
    const [bank_statement_owner_id, setBankStatementOwnerId] = useState(null);
    const [passport_copy, setPassportCopy] = useState(null);
    const [educational_certificates, setEducationalCertificates] = useState(null);
    const [id_copy, setIdCopy] = useState(null);

    const [checkbox, setCheckBox] = useState(false);
    const [userid, setUserId] = useState(0);

    // Add these new states for validation and document status
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [documentsExist, setDocumentsExist] = useState(false);
    const [submittedFields, setSubmittedFields] = useState<string[]>([]);

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
      
       // Handle new file previews
      else if (e.target.name === "offer_letter_school") {
        setOfferLetterSchool(previewUrl);
      } 
     
      else if (e.target.name === "photograph") {
        setPhotograph(previewUrl);
      } else if (e.target.name === "parent_affidavit") {
        setParentAffidavit(previewUrl);
      } else if (e.target.name === "proof_of_residence") {
        setProofOfResidence(previewUrl);
      } else if (e.target.name === "receipt_of_paid_fees") {
        setReceiptOfPaidFees(previewUrl);
      } else if (e.target.name === "itinerary_ticket") {
        setItineraryTicket(previewUrl);
      } else if (e.target.name === "bank_statement") {
        setBankStatement(previewUrl);
      } else if (e.target.name === "bank_statement_owner_id") {
        setBankStatementOwnerId(previewUrl);
      } else if (e.target.name === "passport_copy") {
        setPassportCopy(previewUrl);
      } else if (e.target.name === "educational_certificates") {
        setEducationalCertificates(previewUrl);
      } else if (e.target.name === "id_copy") {
        setIdCopy(previewUrl);
      }
    };

    // Add this useEffect to check if documents already exist
    useEffect(() => {
      const checkExistingDocuments = async () => {
        if (!userid) return;
        
        try {
          const response = await fetch(`/api/checklist-documents/get-documents?user_id=${userid}`);
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
            setSubmittedFields(fields);
          }
        } catch (error) {
          console.error("Error checking documents:", error);
        }
      };
      
      if (userid) {
        checkExistingDocuments();
      }
    }, [userid]);

    // Update the handleSubmit function to include validation
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate required fields for first-time upload
      if (!documentsExist) {
        const errors = {};
        const requiredFields = [
          { key: "photograph", label: "Photograph" },
          { key: "parent_affidavit", label: "Affidavit from Parent" },
          { key: "proof_of_residence", label: "Proof of Residence" },
          { key: "offer_letter", label: "Offer Letter" },
          { key: "offer_letter_school", label: "Offer Letter from School" },
          { key: "receipt_of_paid_fees", label: "Receipt of Paid Fees" },
          { key: "itinerary_ticket", label: "Itinerary/Ticket" },
          { key: "bank_statement", label: "Bank Statement" },
          { key: "bank_statement_owner_id", label: "ID of Bank Statement Owner" },
          { key: "passport_copy", label: "Copy of Passport" },
          { key: "educational_certificates", label: "Educational Certificates" },
          { key: "id_copy", label: "Copy of ID" },
          { key: "admission_letter", label: "Admission Letter" },
          { key: "bonafide_certificate", label: "Bonafide Certificate" },
          { key: "student_undertaking_form", label: "Student Undertaking Form" }
        ];
        
        requiredFields.forEach(field => {
          if (!formData[field.key]) {
            errors[field.key] = `${field.label} is required`;
          }
        });
        
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          toast.error("Please complete all required fields");
          return;
        }
      }
      
      setValidationErrors({});
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

        const data = await res.json();
        toast.dismiss();
        setLoading(false);

        toast.success("Email Sent Successfully !");

        console.log(data);
        console.log(res);
        
        if (res.ok) {
          toast.success(documentsExist ? "Documents updated successfully!" : "Documents uploaded successfully!");
          setDocumentsExist(true);
          
          // Update submitted fields
          const newSubmittedFields = [...submittedFields];
          Object.keys(formData).forEach(key => {
            if (formData[key] && !newSubmittedFields.includes(key)) {
              newSubmittedFields.push(key);
            }
          });
          setSubmittedFields(newSubmittedFields);

      setTimeout(() => {
        const embassyLink = process.env.NEXT_PUBLIC_EMBASSY_LINK;
        if (embassyLink) {
          window.location.href = embassyLink;
        } else {
          console.error("Embassy link is not defined.");
        }
      }, 3000);

         
        } else {
          toast.error(data.error || "Something went wrong");
        }
      } catch (error) {
        setLoading(false);
        toast.dismiss();
        toast.error("Failed to Upload");
      }
    };

    // Add this function to check if a field has been submitted before
    const isFieldSubmitted = (fieldName) => {
      return submittedFields.includes(fieldName);
    };

  return (
    <div>
      <h5 className="section-divider">CheckList Documents</h5>

      <Card className="mb-4">
        <Card.Header as="h6" className="bg-primary text-white">
          Student Visa Application Requirements
        </Card.Header>
        <Card.Body>
          {/* <Alert variant="info">
            <p className="mb-1">Apply online: <a href="http://indianvisaonline.gov.in" target="_blank" rel="noopener noreferrer">http://indianvisaonline.gov.in</a></p>
            <p className="mb-1">Submit visa application form in person to the Embassy</p>
            <p className="mb-1">Visa fee: 83 USD</p>
            <p className="mb-0">Submission Time: 9-11am, Mon-Fri</p>
          </Alert> */}

          <h6 className="mt-3 mb-3">Required Documents:</h6>

          <Row>
            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 1. Photograph
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('photograph') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="photograph"
                    id="photograph"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <label htmlFor="photograph" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('photograph') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {photograph && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.photograph && !photograph && (
                    <div className="validation-error">{validationErrors.photograph}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 2. Affidavit from Parent
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('parent_affidavit') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="parent_affidavit"
                    id="parent_affidavit"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="parent_affidavit" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('parent_affidavit') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {parent_affidavit && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
 {validationErrors.parent_affidavit && !parent_affidavit && (
                    <div className="validation-error">{validationErrors.parent_affidavit}</div>
                  )}
                  
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 3. Proof of Residence
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('proof_of_residence') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="proof_of_residence"
                    id="proof_of_residence"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="proof_of_residence" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('proof_of_residence') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {proof_of_residence && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.proof_of_residence && !proof_of_residence && (
                    <div className="validation-error">{validationErrors.proof_of_residence}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 4. Offer Letter from School
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('offer_letter_school') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="offer_letter_school"
                    id="offer_letter_school"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />

                  <label htmlFor="offer_letter_school" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('offer_letter_school') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {offer_letter_school && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.offer_letter_school && !offer_letter_school && (
                    <div className="validation-error">{validationErrors.offer_letter_school}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 5. Receipt of Paid Fees
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('receipt_of_paid_fees') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="receipt_of_paid_fees"
                    id="receipt_of_paid_fees"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="receipt_of_paid_fees" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('receipt_of_paid_fees') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {receipt_of_paid_fees && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.receipt_of_paid_fees && !receipt_of_paid_fees && (
                    <div className="validation-error">{validationErrors.receipt_of_paid_fees}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 6. Itinerary/Ticket
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('itinerary_ticket') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="itinerary_ticket"
                    id="itinerary_ticket"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="itinerary_ticket" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('itinerary_ticket') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {itinerary_ticket && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.itinerary_ticket && !itinerary_ticket && (
                    <div className="validation-error">{validationErrors.itinerary_ticket}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 7. Bank Statement
                  <span className="text-danger ms-1">*</span>
                </Form.Label>
                <small className="d-block mb-2 text-muted">Bank statement must be authenticated by issuing bank</small>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="bank_statement"
                    id="bank_statement"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="bank_statement" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('bank_statement') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {bank_statement && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.bank_statement && !bank_statement && (
                    <div className="validation-error">{validationErrors.bank_statement}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 8. ID of Bank Statement Owner
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('bank_statement_owner_id') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="bank_statement_owner_id"
                    id="bank_statement_owner_id"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="bank_statement_owner_id" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('bank_statement_owner_id') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {bank_statement_owner_id && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.bank_statement_owner_id && !bank_statement_owner_id && (
                    <div className="validation-error">{validationErrors.bank_statement_owner_id}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 9. Copy of Passport
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('passport_copy') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="passport_copy"
                    id="passport_copy"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="passport_copy" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('passport_copy') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {passport_copy && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.passport_copy && !passport_copy && (
                    <div className="validation-error">{validationErrors.passport_copy}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 10. Educational Certificates
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('educational_certificates') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <small className="d-block mb-2 text-muted">'O' level & 'A' level certificates</small>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="educational_certificates"
                    id="educational_certificates"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="educational_certificates" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('educational_certificates') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {educational_certificates && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.educational_certificates && !educational_certificates && (
                    <div className="validation-error">{validationErrors.educational_certificates}</div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> 11. Copy of ID
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('id_copy') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
                </Form.Label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    name="id_copy"
                    id="id_copy"
                    className="file-input"
                    onChange={handleFileChange}
                    accept="application/pdf, image/*"
                  />
                  <label htmlFor="id_copy" className="file-label">
                    <IoIosCloudUpload className="upload-icon" />
                    <span>{isFieldSubmitted('id_copy') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {id_copy && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.id_copy && !id_copy && (
                    <div className="validation-error">{validationErrors.id_copy}</div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h5 className="section-divider">Additional Documents</h5>

      <Row>

      <Col md={6}>
              <Form.Group className="form-group upload-group">
                <Form.Label className="d-flex align-items-center">
                  <IoIosCloudUpload className="form-icon" /> Offer Letter
                  {!documentsExist && <span className="text-danger ms-1">*</span>}
                  {isFieldSubmitted('offer_letter') && (
                    <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
                  )}
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
                    <span>{isFieldSubmitted('offer_letter') ? 'Replace File' : 'Choose File'}</span>
                  </label>
                  {offer_lette && (
                    <div className="file-preview">
                      <span>File selected</span>
                      <Badge bg="success">Ready to upload</Badge>
                    </div>
                  )}
                  {validationErrors.offer_letter && !offer_lette && (
                    <div className="validation-error">{validationErrors.offer_letter}</div>
                  )}
                </div>
              </Form.Group>
            </Col>
        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Admission Letter
              {!documentsExist && <span className="text-danger ms-1">*</span>}
              {isFieldSubmitted('admission_letter') && (
                <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
              )}
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
                <span>{isFieldSubmitted('admission_letter') ? 'Replace File' : 'Choose File'}</span>
              </label>
              {admission_lette && (
                <div className="file-preview">
                  <span>File selected</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
               {validationErrors.admission_letter && !admission_lette && (
                    <div className="validation-error">{validationErrors.admission_letter}</div>
                  )}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Bonafide Certificate
              {!documentsExist && <span className="text-danger ms-1">*</span>}
              {isFieldSubmitted('bonafide_certificate') && (
                <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
              )}
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
                <span>{isFieldSubmitted('bonafide_certificate') ? 'Replace File' : 'Choose File'}</span>
              </label>
              {bonafide_certificat && (
                <div className="file-preview">
                  <span>File selected</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}

               {validationErrors.bonafide_certificate && !bonafide_certificat && (
                    <div className="validation-error">{validationErrors.bonafide_certificate}</div>
                  )}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="form-group upload-group">
            <Form.Label className="d-flex align-items-center">
              <IoIosCloudUpload className="form-icon" /> Student Undertaking Form
              {!documentsExist && <span className="text-danger ms-1">*</span>}
              {isFieldSubmitted('student_undertaking_form') && (
                <Badge bg="success" className="ms-2 uploaded-badge">Uploaded</Badge>
              )}
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
                <span>{isFieldSubmitted('student_undertaking_form') ? 'Replace File' : 'Choose File'}</span>
              </label>
              {student_undertaking && (
                <div className="file-preview">
                  <span>File selected</span>
                  <Badge bg="success">Ready to upload</Badge>
                </div>
              )}
                {validationErrors.student_undertaking_form && !student_undertaking && (
                    <div className="validation-error">{validationErrors.student_undertaking_form}</div>
                  )}
            </div>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-3 mb-4 mt-4">
        <input
          id="for-checkbox"
          checked={checkbox}
          onChange={handleCheckBox}
          type="checkbox"
        />
        <label className="" htmlFor="for-checkbox">
          I hereby declare that all the information provided by me is true to the
          best of my knowledge and belief.
        </label>
      </div>

     <div className="d-flex justify-content-end">
        <Button onClick={handleSubmit} disabled={!checkbox || loading}>
          {loading ? "Uploading..." : (documentsExist ? "Update Documents" : "Submit Documents")}
        </Button>
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

        .checklist-info {
          margin-bottom: 2rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid var(--primary-blue);
        }
        
        .checklist-title {
          color: var(--primary-blue);
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .checklist-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .checklist-number {
          min-width: 24px;
          height: 24px;
          background-color: var(--primary-blue);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          margin-right: 0.75rem;
        }
        
        .text-danger {
          color: #dc3545 !important;
        }

        .validation-error {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        .uploaded-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Page;

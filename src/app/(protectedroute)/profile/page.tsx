"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Form, Card, Row, Col, Button, Badge } from "react-bootstrap";
import { toast } from "react-hot-toast";
import {
  IoMdPerson,
  IoIosCall,
  IoMdMail,
  IoMdSchool,
  IoMdBriefcase,
  IoIosCloudUpload,
} from "react-icons/io";
import Image from "next/image";
import { FaPen } from "react-icons/fa";
import { useUser } from "@/context/userContext";
import { getUser, getUserProperty } from "@/utils/localStorage";

// Add this interface for the user object
interface UserType {
  id?: string;
  name?: string;
  email?: string;
  profile_img?: string;
  phone_number?: string;
  program_id?: string;
  university_id?: string;
  tenth_certificate?: any;
  twelfth_certificate?: any;
  bachelor_certificate?: any;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    email: string;
    profile_img: string;
    phone_number: string;
    program_id: string;
    university_id: string;
    tenth_certificate: any;
    twelfth_certificate: any;
    bachelor_certificate: any;
    [key: string]: any;
  }>({
    id: "",
    name: "",
    email: "",
    profile_img:"",
    phone_number: "",
    program_id: "",
    university_id: "",
    tenth_certificate: null,
    twelfth_certificate: null,
    bachelor_certificate: null,
  });


  const { usercontext, setUserContext } : any= useUser();

  interface ProgramType {
    id: string;
    name: string;
    [key: string]: any;
  }

  interface UniversityType {
    id: string;
    name: string;
    [key: string]: any;
  }

  const [program, setProgram] = useState<ProgramType[]>([]);
  const [university, setUniversity] = useState<UniversityType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tenthPreview, setTenthPreview] = useState<string | null>(null);
  const [twelfthPreview, setTwelfthPreview] = useState<string | null>(null);

  const [profileToggle, setProfileToggle] = useState(false);


  const [bachelor, setBachelor] = useState(false);

  const [payment_status, setPaymentStatus] = useState(false);

  useEffect(() => {
    const user = getUser() as UserType || {};
    setUserContext((prev: any) => ({
      ...prev,
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      profile_img: user?.profile_img || "",
      phone_number: user?.phone_number || "",
    }));
    if (user?.id) {
      setFormData((prev) => ({
        ...prev,
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        profile_img: user.profile_img || "",
        phone_number: user.phone_number || "",
        program_id: user.program_id || "",
        university_id: user.university_id || "",
        tenth_certificate: user.tenth_certificate || null,
        twelfth_certificate: user.twelfth_certificate || null,
        bachelor_certificate: user.bachelor_certificate || null,
      }));
    }


    axios
      .post("/api/payment/getpaymentinfo", {
        email: user.email,
      })
      .then((response) => {
        console.log("Payment status response:", response.data);

        if (response.data.data.payment_status === 1) {
          setPaymentStatus(true);
        } else {
          setPaymentStatus(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching payment status:", error);
        setPaymentStatus(false);
      });


    const fetchProgram = async () => {
      try {
        const res = await axios.get("/api/programs");
        setProgram(res.data.programs);
        console.log("res.data.programs : ", res.data.programs);
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchProgram();
  }, [setUserContext]);

  useEffect(() => {
    if (formData.program_id) {
      fetchUniversities(formData.program_id);
    }
  }, [formData.program_id]); // Only run when program_id changes

  const fetchUniversities = async (programId: any) => {
    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        body: JSON.stringify({ programId }),
      });
      const data = await res.json();
      setUniversity(data.universities);

      // Ensure the selected university is set properly
      // if (data.universities.length > 0) {
      //   const foundUniversity = data.universities.find(
      //     (uni) => uni.id === formData.university_id
      //   );

      //   if (!foundUniversity) {
      //     setFormData((prev) => ({
      //       ...prev,
      //       university_id: data.universities[0].id, // Set to the first available university if not found
      //     }));
      //   }
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [e.target.name]: file });

      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      if (e.target.name === "tenth_certificate") {
        setTenthPreview(previewUrl);
      } else if (e.target.name === "twelfth_certificate") {
        setTwelfthPreview(previewUrl);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "program_id") {
      console.log("Program ID:", value);
      fetchUniversities(value);
      
      if (["68", "69", "71", "74", "75", "76"].includes(value)) {
        setBachelor(true);
      } else {
        setBachelor(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.id) {
      toast.error("User ID is missing!");
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);

        console.log(key, formData[key]);
        
      }
    });

    try {
      toast.loading("Updating profile...");
      const res = await fetch("/api/update-profile", {
        method: "POST",
        body: formDataToSend,
      });

      const email = getUserProperty<any, 'email'>('email');
      if (!email) {
        toast.error("User email not found");
        setLoading(false);
        toast.dismiss();
        return;
      }

      axios.post("/api/getuserbyemail", { email }).then((res) => {
        console.log(res.data);

        setUserContext((prev: any) => ({
          ...prev,
          id: res.data.user.id,
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          profile_img: res.data.user.profile_img || "",
          phone_number: res.data.user.phone_number || "",
        }));

        localStorage.setItem("user", JSON.stringify(res.data.user));
      });

      const data = await res.json();
      toast.dismiss();
      setLoading(false);

      if (res.ok) {
        toast.success("Profile updated successfully!");
        localStorage.setItem("document_verified", "0");



        axios.post("/api/documentverify/iseligible/updatetozero", { email }).then((res) => {
          console.log(res);
          
        }).catch((err) =>{
          console.log(err);
        })
        axios
          .post("/api/documentverify/updatetozero", { email })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="page-header">
        <h2 className="text-gradient">Your Profile</h2>
        <p className="text-muted">
          Manage your personal information and academic documents
        </p>
      </div>

      <Row className="profile-content">
        <Col md={4}>
          <Card className="profile-card mb-4">
            <Card.Body className="text-center">
              <div className="profile-avatar-container mb-3 d-flex flex-column align-items-center">
                <div className="profile-avatar gradient-blue position-relative">
                  {/* {formData.name ? formData.name.charAt(0).toUpperCase() : "U"} */}
                  <img
                    className="rounded-circle w-100 h-100"
                    src={usercontext?.profile_img || null}
                    alt="aaa"
                  />
                  <FaPen
                    onClick={() => {
                      setProfileToggle(!profileToggle);
                    }}
                    size={24}
                    className="position-absolute bottom-0 end-0 text-primary cursor-pointer"
                  />
                </div>

                {profileToggle && (
                  <Form.Group className="form-group upload-group">
                    <div className="custom-file-upload">
                      <input
                        type="file"
                        name="profile_img"
                        id="profile_img"
                        className="file-input"
                        onChange={handleFileChange}
                        accept="application/pdf, image/*"
                      />
                      <label htmlFor="profile_img" className="file-label">
                        <IoIosCloudUpload className="upload-icon" />
                        <span>Choose File</span>
                      </label>
                    </div>
                  </Form.Group>
                )}
              </div>
              <h3 className="mb-1">{formData.name || "Your Name"}</h3>
              <p className="text-muted mb-3">
                {formData.email || "email@example.com"}
              </p>

              <div className="profile-status">
                <Badge bg="primary" className="profile-badge">
                  Student
                </Badge>
                <Badge bg="success" className="profile-badge">
                  Active
                </Badge>
              </div>

              <hr className="my-3" />

              <div className="document-status">
                <h5 className="mb-3">Document Status</h5>
                <div className="status-item">
                  <span>10th Certificate</span>
                  <Badge
                    bg={
                      localStorage.getItem("document_verified") == "1"
                        ? "success"
                        : "warning"
                    }
                  >
                    {localStorage.getItem("document_verified") == "1"
                      ? "Uploaded"
                      : "Pending"}
                  </Badge>
                </div>
                <div className="status-item">
                  <span>12th Certificate</span>
                  <Badge
                    bg={
                      localStorage.getItem("document_verified") == "1"
                        ? "success"
                        : "warning"
                    }
                  >
                    {localStorage.getItem("document_verified") == "1"
                      ? "Uploaded"
                      : "Pending"}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="contact-info-card">
            <Card.Body>
              <h5 className="card-title">Contact Information</h5>
              <div className="contact-item">
                <IoMdMail className="contact-icon" />
                <span>{formData.email || "Not provided"}</span>
              </div>
              <div className="contact-item">
                <IoIosCall className="contact-icon" />
                <span>{formData.phone_number || "Not provided"}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="edit-profile-card">
            <Card.Body>
              <h4 className="mb-4">Edit Profile</h4>
              <Form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={formData.id} />

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label className="d-flex align-items-center">
                        <IoMdPerson className="form-icon" /> Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        // required
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label className="d-flex align-items-center">
                        <IoMdMail className="form-icon" /> Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        // required
                        placeholder="Enter your email"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label className="d-flex align-items-center">
                        <IoIosCall className="form-icon" /> Phone Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        // required
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {payment_status ? (
                  ""
                ) : (
                  <div>
                    <h5 className="section-divider">Academic Information</h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="form-group">
                          <Form.Label className="d-flex align-items-center">
                            <IoMdBriefcase className="form-icon" /> Program
                          </Form.Label>
                          <Form.Select
                            name="program_id"
                            value={formData.program_id}
                            onChange={handleChange}
                          >
                            <option value="">Select a program</option>
                            {program
                              ? program.map((prog: ProgramType) => (
                                  <option key={prog.id} value={prog.id}>
                                    {prog.name}
                                  </option>
                                ))
                              : null}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="form-group">
                          <Form.Label className="d-flex align-items-center">
                            <IoMdSchool className="form-icon" /> University
                          </Form.Label>
                          <Form.Select
                            name="university_id"
                            value={formData.university_id}
                            onChange={handleChange}
                          >
                            <option value="">Select a university</option>
                            {university
                              ? university.map((uni: UniversityType) => (
                                  <option
                                    key={uni.id}
                                    value={uni.id}
                                  >
                                    {uni.name}
                                  </option>
                                ))
                              : null}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="section-divider">Documents</h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="form-group upload-group">
                          <Form.Label className="d-flex align-items-center">
                            <IoIosCloudUpload className="form-icon" /> 10th
                            Certificate
                          </Form.Label>
                          <div className="custom-file-upload">
                            <input
                              type="file"
                              name="tenth_certificate"
                              id="tenth_certificate"
                              className="file-input"
                              onChange={handleFileChange}
                              accept="application/pdf, image/*"
                            />
                            <label
                              htmlFor="tenth_certificate"
                              className="file-label"
                            >
                              <IoIosCloudUpload className="upload-icon" />
                              <span>Choose File</span>
                            </label>
                            {tenthPreview && (
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
                            <IoIosCloudUpload className="form-icon" /> 12th
                            Certificate
                          </Form.Label>
                          <div className="custom-file-upload">
                            <input
                              type="file"
                              name="twelfth_certificate"
                              id="twelfth_certificate"
                              className="file-input"
                              onChange={handleFileChange}
                              accept="application/pdf, image/*"
                            />
                            <label
                              htmlFor="twelfth_certificate"
                              className="file-label"
                            >
                              <IoIosCloudUpload className="upload-icon" />
                              <span>Choose File</span>
                            </label>
                            {twelfthPreview && (
                              <div className="file-preview">
                                <span>File selected</span>
                                <Badge bg="success">Ready to upload</Badge>
                              </div>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    {bachelor ? (
                      <Row>
                        <Col md={6}>
                          <Form.Group className="form-group upload-group">
                            <Form.Label className="d-flex align-items-center">
                              <IoIosCloudUpload className="form-icon" />{" "}
                              Bachelor Certificate
                            </Form.Label>
                            <div className="custom-file-upload">
                              <input
                                type="file"
                                name="bachelor_certificate"
                                id="bachelor_certificate"
                                className="file-input"
                                onChange={handleFileChange}
                                accept="application/pdf, image/*"
                              />
                              <label
                                htmlFor="bachelor_certificate"
                                className="file-label"
                              >
                                <IoIosCloudUpload className="upload-icon" />
                                <span>Choose File</span>
                              </label>
                              {tenthPreview && (
                                <div className="file-preview">
                                  <span>File selected</span>
                                  <Badge bg="success">Ready to upload</Badge>
                                </div>
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                <div className="form-actions">
                  <Button variant="outline-secondary" className="me-2">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
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
}

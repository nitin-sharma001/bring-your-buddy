"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import "../../assets/styles/style.css";
import axios from "axios";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    country_code:"",
    country_id: "",
    university_country: "",
    course_type_id: "",
    course_trade_id: "",
    id_proof: null,
    password: "",
    confirmPassword: "",
    program_id: "",
    university_id: "",
    tenth_certificate: null,
    twelfth_certificate: null,
    bachelor_certificate: null,
    other_certificate: [],
  });

  const [errors, setErrors] = useState({
    email: "",
    phone_number: "",
    id_proof: "",
    tenth_certificate: "",
    twelfth_certificate: "",
    bachelor_certificate: "",
    other_certificate: "",
  });

  const [country, setCountry] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country_code, setCountryCode] = useState([]);
  const [program, setProgram] = useState([]);
  const [university, setUniversity] = useState([]);
  const [course_type, setCourseType] = useState([]);
  const [course_trade, setCourseTrade] = useState([]);
  const router = useRouter();

  useEffect(() => {

    fetch("/api/countries/country_code")
      .then((res) => res.json())
      .then((res) => setCountryCode(res))
      .catch((error) => console.error(error));



axios
  .post("/api/countries/allcountries")
  .then((res) => {
    setCountries(res.data);
    console.log("country data", res.data);
  })
  .catch((error) => console.error(error));
      

    
      axios("/api/fetchcoursetypes")
      .then((res) => {
        console.log(res.data);
        setCourseType(res.data.result);
      })
      .catch((error) => console.error(error))
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (name === "phone_number") {
      setErrors((prev) => ({
        ...prev,
        phone_number: validatePhoneNumber(value)
          ? ""
          : "Phone number must be 10 digits",
      }));
    }

    if (name === "university_country"){
      console.log("university country", value);
      fetch("/api/universities/getuniversitiesbycountryid", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          setUniversity(res.university);
          console.log("university data", res.university);
          
        })
        .catch((error) => console.error(error));
    }

    if (name === "university_id") {

      console.log("university id", value);
      fetch("/api/universities/getprogramsbyuniversityid", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          setProgram(res.programs);
          console.log("program data", res.programs);
        })
        .catch((error) => console.error(error));
    }

    if (name === "country_code") {
      console.log("code value", value);

      axios
        .post("/api/countries", { id: value })
        .then((res) => {
          setCountry(res.data);
          console.log("country data", res.data);
        })
        .catch((error) => console.error(error));
    }
    
    if (name == "course_type_id") {
      console.log("program id :", value);
      axios
        .post("/api/programs/getprogrambycourseid", { id: value })
        .then((res) => {
          console.log(res.data, "program data");
          setProgram(res.data.programs);
        })
        .catch((error) => console.error(error));
    }

    // if (name === "program_id") {
    //   fetch("/api/universities", {
    //     method: "POST",
    //     body: JSON.stringify({ programId: value }),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => setUniversity(res.universities))
    //     .catch((error) => console.error(error));
    // }


    if (name === "program_id") {
      fetch("/api/fetchcoursetrades", {
        method: "POST",
        body: JSON.stringify({ id: value }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.trades, "course trades");
          setCourseTrade(res.trades);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    const files = e.target.files;

    if (file && file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        [field]: "Required PDF file (only .pdf allowed)",
      }));
      setFormData((prev) => ({
        ...prev,
        [field]: null,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setFormData((prev) => ({
        ...prev,
        [field]: field === "other_certificate" ? Array.from(files) : files[0],
      }));
    }
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "other_certificate" && Array.isArray(value)) {
        value.forEach((file, index) => {
          formDataToSend.append(`other_certificate[${index}]`, file);
        });
      } else if (value) {
        formDataToSend.append(key, value);
      }
    });

    console.log("Form Data Entries:");
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.message === "success") {
        toast.success("Registered Successfully! Check your email for OTP");
        localStorage.setItem("email", formData.email);
        router.push("/verify");
      } else {
        alert("Error in registering");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="w-100 justify-content-center mt-5">
        <div className="">
          <div className="auth-container">
            <div className="auth-card register-card">
              <div className="row g-0">
                {/* Left Side - Form */}
                <div className="col-lg-6 order-lg-2 order-1">
                  <div className="auth-form-container">
                    <div className="mobile-logo d-lg-none text-center mb-4">
                      <img
                        src="/images/logo.png"
                        alt="Bring Your Buddy"
                        className="mobile-logo-img"
                      />
                    </div>

                    <h3 className="auth-title">Create Account</h3>
                    <p className="auth-subtitle">
                      Join our community and bring your buddies along!
                    </p>

                    <Form onSubmit={submitHandler}>
                      {step === 1 && (
                        <>
                          <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              type="text"
                              placeholder="Enter your name"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              type="email"
                              placeholder="Enter your email"
                            />
                            {errors.email && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.email}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Phone Number</Form.Label>
                            <InputGroup>
                              <Form.Select
                                name="country_code"
                                value={formData.country_code}
                                onChange={handleChange}
                                style={{ maxWidth: "120px" }}
                              >
                                {country_code
                                  ? country_code.map((country) => (
                                      <option
                                        key={country?.code_id}
                                        value={country?.country_id}
                                      >
                                        {country?.phone_code}
                                      </option>
                                    ))
                                  : null}
                                {/* Add more as needed */}
                              </Form.Select>

                              <Form.Control
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                type="text"
                                placeholder="Enter your phone number"
                              />
                            </InputGroup>

                            {errors.phone_number && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.phone_number}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                              name="country_id"
                              value={formData.country_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a Country</option>
                              {country
                                ? country.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formIdProof">
                            <Form.Label>ID Proof (PDF only)</Form.Label>
                            <Form.Control
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => handleFileChange(e, "id_proof")}
                            />
                            {errors.id_proof && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.id_proof}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              type="password"
                              placeholder="Enter your password"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Password must be atleast six characters, including
                              at least one uppercase letter, one special
                              character, and one digit.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formConfirmPassword"
                          >
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              type="password"
                              placeholder="Confirm your password"
                            />
                          </Form.Group>

                          <Button
                            variant="primary"
                            onClick={nextStep}
                            className="w-100"
                          >
                            Next
                          </Button>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>
                              For which Country you want to apply
                            </Form.Label>
                            <Form.Select
                              name="university_country"
                              value={formData.university_country}
                              onChange={handleChange}
                            >
                              <option value="">Select a Country</option>
                              {countries
                                ? countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formUniversity"
                          >
                            <Form.Label>Select University</Form.Label>
                            <Form.Select
                              name="university_id"
                              value={formData.university_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a university</option>
                              {university
                                ? university.map((university) => (
                                    <option
                                      key={university.id}
                                      value={university.id}
                                    >
                                      {university.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Course Type</Form.Label>
                            <Form.Select
                              name="course_type_id"
                              value={formData.course_type_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a Course Type</option>
                              {course_type
                                ? course_type.map((type) => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formProgram">
                            <Form.Label>Select Program</Form.Label>
                            <Form.Select
                              name="program_id"
                              value={formData.program_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a program</option>
                              {program
                                ? program.map((program) => (
                                    <option key={program.id} value={program.id}>
                                      {program.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="formCountry">
                            <Form.Label>Course Type</Form.Label>
                            <Form.Select
                              name="course_trade_id"
                              value={formData.course_trade_id}
                              onChange={handleChange}
                            >
                              <option value="">Select a Course Type</option>
                              {course_trade
                                ? course_trade.map((type) => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))
                                : null}
                            </Form.Select>
                          </Form.Group>

                          <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="me-2"
                          >
                            Back
                          </Button>
                          <Button variant="primary" onClick={nextStep}>
                            Next
                          </Button>
                        </>
                      )}

                      {step === 3 && (
                        <>
                          <Form.Group
                            className="mb-3"
                            controlId="formTenthCertificate"
                          >
                            <Form.Label>10th Certificate (PDF only)</Form.Label>
                            <Form.Control
                              type="file"
                              accept="application/pdf"
                              onChange={(e) =>
                                handleFileChange(e, "tenth_certificate")
                              }
                            />
                            {errors.tenth_certificate && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.tenth_certificate}
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group
                            className="mb-3"
                            controlId="formTwelfthCertificate"
                          >
                            <Form.Label>12th Certificate (PDF only)</Form.Label>
                            <Form.Control
                              accept="application/pdf"
                              type="file"
                              onChange={(e) =>
                                handleFileChange(e, "twelfth_certificate")
                              }
                            />
                            {errors.twelfth_certificate && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.twelfth_certificate}
                              </div>
                            )}
                          </Form.Group>

                          {formData.course_type_id == "2" ? (
                            <Form.Group
                              className="mb-3"
                              controlId="formBachelorCertificate"
                            >
                              <Form.Label>
                                Bachelor Certificate (PDF only)
                              </Form.Label>
                              <Form.Control
                                accept="application/pdf"
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(e, "bachelor_certificate")
                                }
                              />
                              {errors.bachelor_certificate && (
                                <div style={{ color: "red", fontSize: "14px" }}>
                                  {errors.bachelor_certificate}
                                </div>
                              )}
                            </Form.Group>
                          ) : (
                            ""
                          )}

                          <Form.Group
                            className="mb-3"
                            controlId="formOtherCertificates"
                          >
                            <Form.Label>
                              Other Certificates (PDF only)
                            </Form.Label>
                            <Form.Control
                              type="file"
                              accept="application/pdf"
                              onChange={(e) =>
                                handleFileChange(e, "other_certificate")
                              }
                              multiple
                            />
                            {errors.other_certificate && (
                              <div style={{ color: "red", fontSize: "14px" }}>
                                {errors.other_certificate}
                              </div>
                            )}
                          </Form.Group>

                          <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="me-2"
                          >
                            Back
                          </Button>
                          <Button type="submit" variant="primary">
                            Submit
                          </Button>
                        </>
                      )}
                    </Form>
                  </div>
                </div>

                {/* Right Side - Image */}
                <div className="col-lg-6 d-none d-lg-block order-lg-1 order-2">
                  <div
                    className="auth-image register-image"
                    style={{
                      backgroundImage: "url('./images/reg.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="overlay"></div>
                    <div className="auth-image-content">
                      <div className="logo-container">
                        <img
                          src="/images/logo.png"
                          alt="Bring Your Buddy"
                          className="logo-img"
                        ></img>
                      </div>
                      <h2>Join Our Community</h2>
                      <p>
                        Create an account to start bringing your buddies for
                        amazing experiences and adventures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
}

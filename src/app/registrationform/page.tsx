"use client";

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const Page = () => {
  const [fileInputs, setFileInputs] = useState({
    tenthCertificate: null,
    twelfthCertificate: null,
    otherCertificates: [],
  });

  const [filePaths, setFilePaths] = useState({
    tenthCertificate: null,
    twelfthCertificate: null,
    otherCertificates: [],
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files) {
      if (field === "otherCertificates") {
        // Store multiple files in state
        setFileInputs((prev) => ({
          ...prev,
          [field]: Array.from(e.target.files),
        }));
      } else {
        // Store single file in state
        setFileInputs((prev) => ({
          ...prev,
          [field]: e.target.files[0],
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Append files to FormData for upload
    if (fileInputs.tenthCertificate) {
      formData.append("tenthCertificate", fileInputs.tenthCertificate);
    }

    if (fileInputs.twelfthCertificate) {
      formData.append("twelfthCertificate", fileInputs.twelfthCertificate);
    }

    if (fileInputs.otherCertificates.length > 0) {
      fileInputs.otherCertificates.forEach((file) => {
        formData.append("otherCertificates", file);
      });
    }


    console.log("formData : ", formData);
    

    
  };

  return (
    <div>
      <h1>Registration Form</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTenthCertificate">
          <Form.Label>Certificate 10th:</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => handleFileChange(e, "tenthCertificate")}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTwelfthCertificate">
          <Form.Label>Certificate 12th:</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => handleFileChange(e, "twelfthCertificate")}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formOtherCertificates">
          <Form.Label>Other Certificates:</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, "otherCertificates")}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Page;

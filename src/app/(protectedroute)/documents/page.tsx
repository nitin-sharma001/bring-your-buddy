"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFilePdf, FaRegClock, FaGraduationCap } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaEye, FaFileAlt, FaCheckCircle, FaCreditCard, FaUniversity } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
// import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/build/pdf.worker.entry";
import { Button, Card, Badge, ProgressBar } from "react-bootstrap";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";

import React from 'react'


import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


interface OfferLetter {
  name: string;
  url: string;
}

interface ThumbnailsState {
  [key: string]: string;
}

const page = () => {

      const [documents, setDocuments] = useState<OfferLetter[]>([]);
      const [paymentStatus, setPaymentStatus] = useState(0);

      const [user, setUser] = useState({});

      const [loading, setLoading] = useState(true);
      const router = useRouter();

      const [thumbnail, setThumbnail] = useState("");
      const [thumbnails, setThumbnails] = useState<ThumbnailsState>({});

        useEffect(() => {
          documents.forEach((file) => {
            if (!thumbnails[file.url]) {
              generateThumbnails(file.url);
            }
          });
        }, [documents]);


          const generateThumbnails = async (pdfUrl: string) => {
            try {
              const loadingTask = pdfjsLib.getDocument(pdfUrl);
              const pdf = await loadingTask.promise;
              const page = await pdf.getPage(1);
        
              const scale = 1.5;
              const viewport = page.getViewport({ scale });
        
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              
              if (!context) {
                console.error("Could not get canvas context");
                return;
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
useEffect(() => {
  setLoading(true);
  const userString = localStorage.getItem("user");
  const email = userString ? JSON.parse(userString)?.email : null;
  if (!email) {
    router.push("/login");
    return;
  }

  
  const getUserDetails = () => {
    axios
      .post("/api/getuserbyemail", { email })
      .then((res) => {
        setUser(res.data.user);

      })
      .catch((err) => {
        console.log(err);
      });
  };

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




  getUserDetails();
  fetchDocuments();
  getPaymentInfo();


  setLoading(false);
}, [router]);
  return (
    <div className="content-card fade-in delay-1">
      <div className="content-card-header">
        <div className="header-title-section">
          <div className="header-icon">
            <IoDocumentText />
          </div>
          <div className="header-text">
            <h5>Your Documents</h5>
            <p className="header-subtitle">View and download your important files</p>
          </div>
        </div>
        {paymentStatus === 0 && documents.length > 0 && (
          <div className="card-actions">
            <Button
              variant="primary"
              className="btn-action"
              onClick={() => router.push("/payment")}
            >
              <FaCreditCard /> Make Payment
            </Button>
          </div>
        )}
      </div>
      <div className="content-card-body">
        {paymentStatus === 1 ? (
          documents.length > 0 ? (
            <div className="row">
              {documents.map((file, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="document-card h-100 fade-in">
                    <div className="document-preview">
                      {thumbnails[file.url] ? (
                        <div 
                          style={{
                            backgroundImage: `url(${thumbnails[file.url]})`,
                          }}
                          className="document-thumbnail"
                        >
                          <div className="overlay">
                            <FaFilePdf className="pdf-icon" />
                          </div>
                        </div>
                      ) : (
                        <div className="document-thumbnail-loading">
                          <FaFilePdf className="pdf-icon-loading" />
                        </div>
                      )}
                    </div>
                    <div className="document-details">
                      <h5 className="document-title">{file.name}</h5>

                      <div className="document-status d-flex ">
                        <Badge bg="success d-flex " className="me-2">
                          <FaCheckCircle className="me-1" /> Verified
                        </Badge>
                      </div>

                      <div className="document-actions">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-light action-btn"
                          title="View Document"
                        >
                          <FaEye />
                        </a>
                        <a
                          href={file.url}
                          download={file.name}
                          className="btn btn-sm btn-light action-btn"
                          title="Download Document"
                        >
                          <MdOutlineFileDownload />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-5">
              <div className="empty-icon mb-3">
                <FaFileAlt size={48} className="text-muted" />
              </div>
              <h5>No Documents Available</h5>
              <p className="text-muted">
                Your documents will be displayed here once they're ready
              </p>
            </div>
          )
        ) : (
          <div className="payment-required text-center py-5">
            <div className="empty-icon mb-3">
              <FaCreditCard size={48} className="text-danger" />
            </div>
            <h5>Payment Required</h5>
            <p className="text-muted mb-4">
              Your documents will be generated after payment is completed
            </p>
            <Button
              variant="danger"
              onClick={() => router.push("/payment")}
              className="pulse-animation"
            >
              Complete Payment
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        .content-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .header-title-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          background: var(--primary-color, #007bff);
          color: white;
          border-radius: 12px;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
        }
        
        .header-text {
          display: flex;
          flex-direction: column;
        }
        
        .header-text h5 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
        }
        
        .header-subtitle {
          margin: 0;
          font-size: 14px;
          color: #718096;
        }

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

        .document-preview {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .document-thumbnail {
          height: 200px;
          background-size: cover;
          background-position: top center;
          border-bottom: 1px solid #f0f0f0;
          position: relative;
        }
        
        .document-thumbnail-loading {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .pdf-icon-loading {
          font-size: 48px;
          color: #dc3545;
          opacity: 0.7;
        }
        
        .overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .pdf-icon {
          font-size: 20px;
          color: #dc3545;
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

export default page

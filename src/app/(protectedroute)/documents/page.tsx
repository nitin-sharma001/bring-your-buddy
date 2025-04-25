"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaEye, FaFileAlt, FaCheckCircle, FaCreditCard, FaUniversity } from "react-icons/fa";

import axios from "axios";
import { Button, Badge, } from "react-bootstrap";

import { motion } from "framer-motion";
import React from 'react';

interface OfferLetter {
  name: string;
  url: string;
}

const Page = () => {
      const [documents, setDocuments] = useState<OfferLetter[]>([]);
      const [paymentStatus, setPaymentStatus] = useState(0);
      const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

      const router = useRouter();

  const openPdfPreview = (url: string, name: string) => {
    setPreviewURL(url);
    setPreviewName(name);
    setShowPreview(true);
  };

  const closePdfPreview = () => {
    setShowPreview(false);
    setPreviewURL(null);
    setPreviewName(null);
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

  // Function to create PDF preview cards
  const renderDocumentCards = () => {
    return documents.map((file, index) => (
      <motion.div
        key={index}
        className="col-lg-4 col-md-6 mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="document-card">
          <div className="card-inner">
            <div className="card-front">
              <div className="doc-preview">
                <iframe
                  src={file.url}
                  className="doc-preview-iframe"
                  title={file.name}
                  frameBorder="0"
                />
                <div className="preview-overlay"></div>
              </div>
              <div className="d-flex align-items-center justify-content-between ">
                <div className="doc-info">
                  <h5 className="doc-title">{file.name}</h5>
                  <div className="doc-meta">
                    <Badge className="verified-badge d-flex align-items-center gap-2">
                      <FaCheckCircle /> Verified
                    </Badge>
                  </div>
                </div>
                <div className="card-overlay pe-5 pt-3">
                  <div className="overlay-content">
                    <div className="action-buttons d-flex align-items-center gap-3 ">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button preview-btn"
                      >
                        <FaEye />
                      </a>
                      <a
                        href={file.url}
                        download={file.name}
                        className="action-button download-btn"
                      >
                        <MdOutlineFileDownload />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="documents-container">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">My Documents</h2>
          <p className="page-subtitle">Your important documents and certificates</p>
        </div>
        
        {paymentStatus === 0 && documents.length > 0 && (
          <div className="header-actions">
            <Button
              variant="gradient"
              className="payment-btn"
              onClick={() => router.push("/payment")}
            >
              <FaCreditCard className="me-2" /> Complete Payment
            </Button>
          </div>
        )}
      </div>

      <div className="content-container">
        {paymentStatus === 1 ? (
          documents.length > 0 ? (
            <div className="documents-grid">
              <div className="row">{renderDocumentCards()}</div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FaFileAlt />
              </div>
              <h3>No Documents Available</h3>
              <p>Your documents will be displayed here once they're ready</p>
            </div>
          )
        ) : (
          <div className="payment-required">
            <div className="payment-icon">
              <FaCreditCard />
            </div>
            <h3>Payment Required</h3>
            <p>Your documents will be generated after payment is completed</p>
            <Button
              variant="gradient"
              onClick={() => router.push("/payment")}
              className="mt-4 payment-btn-pulse"
            >
              Complete Payment
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        .documents-container {
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 12px;
          min-height: 80vh;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #343a40;
          position: relative;
        }
        
        .page-title:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #4a6cf7, #6e8fff);
          border-radius: 2px;
        }
        
        .page-subtitle {
          color: #6c757d;
          margin-bottom: 0;
          margin-top: 12px;
        }
        
        .content-container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .documents-grid {
          margin-top: 1rem;
        }
        
        /* Updated card design with PDF preview */
        .document-card {
          position: relative;
          height: 320px;
          perspective: 1500px;
          width: 100%;
        }
        
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }
        
        .card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(225, 230, 245, 0.7);
        }
        
        .doc-preview {
          position: relative;
          height: 200px;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
        }
        
        .doc-preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
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
        
        .doc-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 16px;
        }
        
        .doc-title {
          font-size: 17px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.4;
        }
        
        .doc-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        
        .verified-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 20px;
          box-shadow: 0 2px 6px rgba(40, 167, 69, 0.2);
        }
        
        .doc-type {
          font-size: 13px;
          color: #6c757d;
          display: flex;
          align-items: center;
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(74, 108, 247, 0.65) 100%);
          border-radius: 20px;
          opacity: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transition: opacity 0.4s ease;
          z-index: 10;
        }
        
        .overlay-content {
          width: 100%;
          padding: 25px;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.4s ease;
          transition-delay: 0.1s;
        }
        
        .action-buttons {
          display: flex;
          flex-direction: row;
          gap: 10px;
          width: 100%;
        }
        
        .action-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-decoration: none;
          color: white;
        }
        
        .preview-btn {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
        }
        
        .download-btn {
          background: white;
          color: #4a6cf7;
        }
        
        .action-button:hover {
          transform: translateY(-3px);
        }
        
        .preview-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        
        .download-btn:hover {
          background: #f8f9fa;
        }
        
        /* Card hover effects */
        .document-card:hover .card-overlay {
          opacity: 1;
        }
        
        .document-card:hover .overlay-content {
          transform: translateY(0);
          opacity: 1;
        }
        
        .document-card:hover .card-front {
          box-shadow: 0 15px 35px rgba(74, 108, 247, 0.15);
          border-color: rgba(74, 108, 247, 0.1);
        }
        
        /* Payment and empty states */
        .payment-btn {
          background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 30px;
          color: white;
          font-weight: 500;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
          transition: all 0.3s ease;
        }
        
        .payment-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 107, 107, 0.4);
          background: linear-gradient(90deg, #ff5252, #ff7575);
        }
        
        .payment-btn-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
          }
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          color: #6c757d;
        }
        
        .empty-state,
        .payment-required {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }
        
        .empty-icon,
        .payment-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .empty-icon {
          color: #6c757d;
          background-color: #f8f9fa;
        }
        
        .payment-icon {
          color: #fff;
          background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }
        
        .empty-state h3,
        .payment-required h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        
        .empty-state p,
        .payment-required p {
          color: #6c757d;
          max-width: 400px;
        }
        
        .iframe-container {
          width: 100%;
          height: 80vh;
          overflow: hidden;
        }
        
        .pdf-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .modal-icon {
          color: #dc3545;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-actions {
            margin-top: 1rem;
            width: 100%;
          }
          
          .payment-btn {
            width: 100%;
          }
          
          .content-container {
            padding: 1.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Page;

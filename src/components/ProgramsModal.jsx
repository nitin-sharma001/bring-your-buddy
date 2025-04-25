'use client';

import { useEffect, useRef } from 'react';

export default function ProgramDetailsModal({ program, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    // Add close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Add close on click outside
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent scrolling of body when modal is open
    document.body.style.overflow = 'hidden';
    
    // Apply entrance animation class after a small delay
    const timer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.classList.add('active');
      }
    }, 10);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [onClose]);

  // Handle animation on close
  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove('active');
      modalRef.current.classList.add('closing');
      setTimeout(onClose, 300); // Match this to the CSS transition time
    }
  };

  if (!program) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-container">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>

        <div className="modal-header">
          <div className="university-badge">
            <span className="university-initial">{program.name.charAt(0)}</span>
          </div>

          <div>
            <h2 className="modal-title">{program.name}</h2>
            <div className="program-badge">{program.name}</div>
          </div>
        </div>

        <div className="modal-content">
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">Location</div>
              <div className="detail-value">{program.location}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Campus</div>
              <div className="detail-value">{program.campus}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Application Fee</div>
              <div className="detail-value">₹{program.fees}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Annual Fee</div>
              <div className="detail-value">₹{program.annual_fees}</div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="description-section">
            <h3 className="description-title">Program Description</h3>
            <p className="description-text">{program.description}</p>
          </div>

          <div className="action-buttons">
            <button className="action-button apply-button">Apply Now</button>
            <button className="action-button save-button">Save Program</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background-color: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transform: translateY(20px);
          opacity: 0;
          transition:
            transform 0.3s ease,
            opacity 0.3s ease;
          position: relative;
        }

        .modal-container.active {
          transform: translateY(0);
          opacity: 1;
        }

        .modal-container.closing {
          transform: translateY(20px);
          opacity: 0;
        }

        .close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a5568;
          z-index: 10;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.8);
        }

        .close-button:hover {
          color: #2d3748;
          background-color: rgba(255, 255, 255, 1);
        }

        .modal-header {
          padding: 25px 30px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(135deg, #4a6baf 0%, #263c66 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .university-badge {
          width: 60px;
          height: 60px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .university-initial {
          font-size: 28px;
          font-weight: 700;
        }

        .modal-title {
          margin: 0 0 5px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .program-badge {
          display: inline-block;
          padding: 4px 10px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          font-size: 14px;
          font-weight: 500;
        }

        .modal-content {
          padding: 30px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 14px;
          color: #718096;
          margin-bottom: 5px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
        }

        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 25px 0;
        }

        .description-section {
          margin-bottom: 30px;
        }

        .description-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 15px 0;
          color: #2d3748;
        }

        .description-text {
          line-height: 1.6;
          color: #4a5568;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }

        .action-button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            transform 0.2s ease;
        }

        .action-button:hover {
          transform: translateY(-2px);
        }

        .apply-button {
          background-color: #4a6baf;
          color: white;
        }

        .apply-button:hover {
          background-color: #3a5795;
        }

        .save-button {
          background-color: #e2e8f0;
          color: #4a5568;
        }

        .save-button:hover {
          background-color: #cbd5e0;
        }

        @media (max-width: 640px) {
          .details-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .modal-header {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          .university-badge {
            margin-bottom: 10px;
          }

          .modal-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
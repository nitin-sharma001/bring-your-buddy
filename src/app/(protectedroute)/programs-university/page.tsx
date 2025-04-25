'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaUniversity, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import ProgramDetailsModal from "../../../components/ProgramsModal";
import axios from 'axios';



export default function ProgramsSection() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState([]);

  const openModal = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const fetchData = () => {
    axios("/api/universities").then((res) => {
      console.log(res.data.universities);

      setData(res.data.universities);
      
    }).catch((err) => {
      console.log(err);
      
    })
  }

  useEffect(() => {
fetchData();
  } , []);

  return (
    <section className="programs-section">
      <div className="section-header">
        <h2 className="section-title">Programs and Universities</h2>
        <p className="section-subtitle">
          Explore top academic programs from leading universities worldwide
        </p>
      </div>

      <div className="programs-grid">
        {data.length > 0
          ? data.map((program) => (
              <div key={program.id} className="program-card">
                <div className="card-header">
                  <h3 className="university-name">{program?.universityName}</h3>
                  <span className="program-name">{program?.name}</span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-label">
                      <FaMapMarkerAlt className="info-icon" /> Location:
                    </span>
                    <span className="info-value">{program?.location}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">
                      <FaUniversity className="info-icon" /> Campus:
                    </span>
                    <span className="info-value">{program?.campus}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">
                      <FaMoneyBillWave className="info-icon" /> Application Fee:
                    </span>
                    <span className="info-value">₹{program?.fees}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">
                      <FaCalendarAlt className="info-icon" /> Annual Fee:
                    </span>
                    <span className="info-value">₹{program?.annual_fees}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="details-button bg-danger"
                    onClick={() => openModal(program)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          : ""}
      </div>

      {isModalOpen && selectedProgram && (
        <ProgramDetailsModal program={selectedProgram} onClose={closeModal} />
      )}

      <style jsx>{`
        .programs-section {
          padding: 60px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 12px;
        }

        .section-subtitle {
          font-size: 18px;
          color: #718096;
          max-width: 700px;
          margin: 0 auto;
        }

        .programs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 30px;
        }

        .program-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .program-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          padding: 20px;
          background: linear-gradient(135deg, #4a6baf 0%, #263c66 100%);
          color: white;
        }

        .university-name {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 5px 0;
        }

        .program-name {
          font-size: 16px;
          font-weight: 500;
          opacity: 0.9;
        }

        .card-body {
          padding: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .info-label {
          color: #4a5568;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-icon {
          color: #4a6baf;
        }

        .info-value {
          color: #2d3748;
          font-weight: 600;
        }

        .card-footer {
          padding: 15px 20px;
          background-color: #f8f9fa;
          border-top: 1px solid #edf2f7;
          text-align: center;
        }

        .details-button {
          background-color: #4a6baf;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .details-button:hover {
          background-color: #3a5795;
        }

        @media (max-width: 768px) {
          .programs-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }

          .section-title {
            font-size: 26px;
          }

          .section-subtitle {
            font-size: 16px;
          }
        }
      `}</style>
    </section>
  );
}
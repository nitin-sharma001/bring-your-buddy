"use client"
import { useEffect, useState, useRef } from "react";
import "../assets/styles/dashboard.css";
import NotificationsDropdown from "./NotificationsDropdown";
import { FaUser, FaSignOutAlt, FaChevronDown, FaChevronUp, FaSearch, FaBars } from "react-icons/fa";
import { useUser } from "@/context/userContext";

interface User {
  name?: string;
  email?: string;
  [key: string]: any;
}

export default function DashboardNavbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { usercontext } = useUser();

    useEffect(() => {
    const fetchUser = async () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
      }
    };

    fetchUser();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
  
  }

  return (
    <nav className="dashboard-navbar py-3">
      <div className="navbar-left">
        <button className="mobile-toggle-btn" id="mobileToggleBtn">
          <FaBars />
        </button>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar-right">
        <NotificationsDropdown />

        <div className="profile-dropdown" ref={dropdownRef}>
          <div className="profile-info" onClick={toggleDropdown}>
            <div className="profile-pic">
              <img
                src={usercontext.profile_img || user?.profile_img}
                alt="Profile Picture"
              />
            </div>
            <div className="profile-name">
              <span>{usercontext.name || user?.name || "User"}</span>
              {isDropdownOpen ? (
                <FaChevronUp className="chevron-icon" />
              ) : (
                <FaChevronDown className="chevron-icon" />
              )}
            </div>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="/profile">
                <FaUser className="menu-icon" /> My Profile
              </a>

              <button onClick={() => handleLogout()}>
                <a href="/login">
                  <FaSignOutAlt className="menu-icon" /> Logout
                </a>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 1000;
        }

        .navbar-left,
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .mobile-toggle-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          margin-right: 15px;
          display: none;
        }

        .search-box {
          display: flex;
          align-items: center;
          background-color: #f1f5f9;
          border-radius: 8px;
          padding: 8px 15px;
        }

        .search-box input {
          border: none;
          background: none;
          margin-left: 8px;
          outline: none;
          width: 200px;
        }

        .profile-dropdown {
          position: relative;
        }

        .profile-info {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .profile-info:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .profile-pic {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;
        }

        .profile-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-name {
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        .profile-name span {
          margin-right: 8px;
        }

        .chevron-icon {
          font-size: 12px;
          color: #718096;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 220px;
          z-index: 100001;
          overflow: hidden;
          animation: dropdownFade 0.2s ease-out;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-menu a {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          color: #4a5568;
          text-decoration: none;
          transition: background-color 0.2s;
        }

        .dropdown-menu a:hover {
          background-color: #f7fafc;
          color: #2d3748;
        }

        .menu-icon {
          margin-right: 12px;
          width: 16px;
          text-align: center;
          color: #718096;
        }

        .dropdown-menu a:not(:last-child) {
          border-bottom: 1px solid #edf2f7;
        }

        @media (max-width: 768px) {
          .mobile-toggle-btn {
            display: block;
          }

          .search-box {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}

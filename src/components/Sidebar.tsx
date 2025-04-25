"use client";
import React, { useState, useEffect } from "react";
import "../assets/styles/dashboard.css";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Nav, Button, Badge, Offcanvas, Image } from "react-bootstrap";
import { 
  IoIosArrowBack, 
  IoIosArrowForward, 
  IoIosLogOut,
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosCheckmarkCircle
} from "react-icons/io";
import { 
  IoHome, 
  IoSchool, 
  IoDocumentText, 
  IoSettings,
  IoReceipt,
  IoCard
} from "react-icons/io5";
import { GoChecklist } from "react-icons/go";
import axios from "axios";
import { MdLocationCity } from "react-icons/md";
import { FaPlaneDeparture } from "react-icons/fa";
import { useUser } from "@/context/userContext";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(true);
  const [activeAppStep, setActiveAppStep] = useState<number | null>(null);
  const [hasSubmittedApp, setHasSubmittedApp] = useState(false);
  const [hasGeneratedOffer, setHasGeneratedOffer] = useState(false);
  const [hasCompletedPayment, setHasCompletedPayment] = useState(false);
  const router = useRouter();
  const pathname = usePathname();


  const {
    setAppSubmitted,
    setOfferLetterStatus,
    setPaymentCompletedStatus,application_submitted_status,offer_letter_status,payent_completed_status
  } :any= useUser();

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };


    checkMobile();

    window.addEventListener("resize", checkMobile);

    // Get user data
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Check application status from localStorage

    const email = JSON.parse(localStorage.getItem("user")).email;

    axios
      .post("/api/offer-letter/getStatus", { email })
      .then((res) => {
        console.log("offer letter ", res);

        if (res.data[0].offer_letter_status == 0) {
          setHasGeneratedOffer(false);
          setOfferLetterStatus(false);
        } else if (res.data[0].offer_letter_status == 1) {
          setOfferLetterStatus(true);
          setHasGeneratedOffer(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setHasGeneratedOffer(false);
      });

    axios
      .post("/api/payment/getpaymentinfo", { email })
      .then((res) => {
        console.log(" getpaymentinfo", res);

        if (res.data.data.payment_status == 0) {
          setHasCompletedPayment(false);
          setPaymentCompletedStatus(false);
        } else if (res.data.data.payment_status == 1) {
          setPaymentCompletedStatus(true);
          setHasCompletedPayment(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setHasCompletedPayment(false);
      });
    
    // setHasSubmittedApp(hasApp);

    axios
      .post("/api/application-submitted/get-status", { email })
      .then((res) => {
        console.log("application submitted get Status", res);

        if (res.data.status.application_submitted == 0) {
          setHasSubmittedApp(false);
          setAppSubmitted(false);
        } else if (res.data.status.application_submitted == 1) {
          setAppSubmitted(true);
          setHasSubmittedApp(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setHasSubmittedApp(false);
      });

    // Set active app step based on status
    if (hasCompletedPayment) {
      setActiveAppStep(3);
    } else if (hasGeneratedOffer) {
      setActiveAppStep(2);
    } else if (hasSubmittedApp) {
      setActiveAppStep(1);
    } else {
      setActiveAppStep(null);
    }

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // This effect will run whenever pathname changes
    console.log("Current pathname:", pathname);
    
    // Mark dropdown items as active based on pathname
    if (pathname === "/applications" || 
        pathname === "/applications/offerletter" || 
        pathname === "/applications/payment") {
      setIsAppDropdownOpen(true); // Always keep dropdown open on application pages
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAppDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAppDropdownOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    // localStorage.removeItem("document_verified");
    // localStorage.removeItem("offerletter");
    // localStorage.removeItem("application_submitted");
    // localStorage.removeItem("payment_completed");
    router.push("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <IoHome className="menu-icon-svg" />,
      path: "/dashboard",
    },
    {
      title: "Payments",
      icon: <IoCard className="menu-icon-svg" />,
      path: "/payment",
    },
    {
      title: "Programs & University",
      icon: <IoSchool className="menu-icon-svg" />,
      path: "/programs-university",
    },
    {
      title: "Documents",
      icon: <IoDocumentText className="menu-icon-svg" />,
      path: "/documents",
      badge: 4,
    },
    {
      title: "CheckList",
      icon: <GoChecklist className="menu-icon-svg" />,
      path: "/checklist",
    },
    {
      title: "Embassy",
      icon: <MdLocationCity className="menu-icon-svg" />,
      path: "/embassy",
    },
    {
      title: "Airport",
      icon: <FaPlaneDeparture className="menu-icon-svg" />,
      path: "/airport",
    },
    {
      title: "Profile",
      icon: <IoSettings className="menu-icon-svg" />,
      path: "/profile",
    },
  ];

  // Define the app process steps
  const applicationSteps = [
    {
      title: "Submitted Applications",
      icon: <IoDocumentText className="menu-icon-svg" />,
      path: "/applications",
      isCompleted: hasSubmittedApp || application_submitted_status,
      step: 1
    },
    {
      title: "Generate Offer Letter",
      icon: <IoReceipt className="menu-icon-svg" />,
      path: "/applications/offerletter",
      isCompleted: hasGeneratedOffer || offer_letter_status,
      isDisabled: !hasSubmittedApp,
      step: 2
    },
    {
      title: "Payment",
      icon: <IoCard className="menu-icon-svg" />,
      path: "/applications/payment",
      isCompleted: hasCompletedPayment || payent_completed_status,
      isDisabled: !hasGeneratedOffer,
      step: 3
    }
  ];

  if (isMobile) {
    return (
      <>
        <Button 
          variant="primary"
          className="d-lg-none mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Open Menu"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>

        <Offcanvas 
          show={isSidebarOpen} 
          onHide={() => setIsSidebarOpen(false)} 
          responsive="lg" 
          className="sidebar-offcanvas border-0"
          backdrop="static"
        >
          <Offcanvas.Header closeButton className="border-bottom bg-light">
            <Offcanvas.Title className="w-100 text-center">
              <Image 
                src="/images/logo.png" 
                alt="Bring Your Buddy Logo" 
                className="sidebar-logo" 
              />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0 bg-white">
            {user && (
              <div className="user-profile-card p-3 mb-2">
                <div className="d-flex align-items-center">
                  <div className="profile-avatar gradient-blue text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 fw-semibold">{user.name || "User"}</h6>
                    <small className="text-muted">{user.email || ""}</small>
                  </div>
                </div>
              </div>
            )}
            
            <Nav className="flex-column sidebar-nav">
              <Nav.Item key="dashboard">
                <Link href="/dashboard" passHref legacyBehavior>
                  <Nav.Link
                    className={`sidebar-nav-link ${pathname === "/dashboard" ? "active" : ""}`}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <span className="nav-icon-container">
                      <IoHome className="menu-icon-svg" />
                    </span>
                    <span className="menu-title">Dashboard</span>
                  </Nav.Link>
                </Link>
              </Nav.Item>

              {/* Application Process with Steps */}
              <Nav.Item>
                <div
                  className={`sidebar-nav-link ${pathname.startsWith("/applications") ? "active" : ""}`}
                  onClick={(e) => {
                    toggleAppDropdown(e);
                    router.push("/applications");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span className="nav-icon-container">
                    <IoDocumentText className="menu-icon-svg" />
                  </span>
                  <span className="menu-title">My Application</span>
                  <span className="ms-auto">
                    {isAppDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </div>

                <div
                  className={`app-steps-dropdown ${isAppDropdownOpen ? "show" : "hide"}`}
                >
                  {applicationSteps.map((step, idx) => (
                    <div key={idx} className="app-step-wrapper">
                      <Link
                        href={step.isDisabled ? "#" : step.path}
                        passHref
                        legacyBehavior
                      >
                        <Nav.Link
                          className={`app-step-link ${
                            step.path === pathname ? "active" : ""
                          } ${step.isDisabled ? "disabled" : ""} ${step.step === activeAppStep ? "current-step" : ""}`}
                          onClick={(e) => {
                            if (step.isDisabled) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          <span className="step-icon-container">
                            {step.icon}
                          </span>
                          <span className="step-title">{step.title}</span>
                          {step.isCompleted && (
                            <span className="ms-auto completed-icon">
                              <IoIosCheckmarkCircle className="text-success" />
                            </span>
                          )}
                        </Nav.Link>
                      </Link>
                    </div>
                  ))}
                </div>
              </Nav.Item>

              {menuItems.slice(1).map((item, index) => (
                <Nav.Item key={index}>
                  <Link href={item.path} passHref legacyBehavior>
                    <Nav.Link 
                      className={`sidebar-nav-link ${pathname === item.path ? "active" : ""}`}
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                      <span className="nav-icon-container">{item.icon}</span>
                      <span className="menu-title">{item.title}</span>
                      {item.badge && (
                        <Badge bg="primary" pill className="pulse-badge">
                          {item.badge}
                        </Badge>
                      )}
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              ))}
              
              <Nav.Item className="mt-auto">
                <Button 
                  variant="link" 
                  className="sidebar-nav-link text-dark logout-btn"
                  onClick={handleLogout}
                >
                  <span className="nav-icon-container">
                    <IoIosLogOut />
                  </span>
                  <span className="menu-title">Logout</span>
                </Button>
              </Nav.Item>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  // Desktop version
  return (
    <div className={`sidebar-wrapper ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-container h-100 shadow-sm">
        <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-3">
          {isSidebarOpen ? (
            <div className="logo-container">
              <Image 
                src="/images/logo.png" 
                alt="Bring Your Buddy Logo" 
                height={32} 
                width={98} 
                className="sidebar-logo"
              />
            </div>
          ) : (""
          )}
          <Button 
            variant="primary" 
            size="sm" 
            className="toggle-btn border-0 m-0"
            onClick={toggleSidebar} 
            aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </Button>
        </div>
        
        <div className="sidebar-menu mt-2">
          <Nav className="flex-column">
            <Nav.Item key="dashboard">
              <Link href="/dashboard" passHref legacyBehavior>
                <Nav.Link 
                  className={`sidebar-nav-link ${pathname === "/dashboard" ? "active" : ""}`}
                  title={!isSidebarOpen ? "Dashboard" : undefined}
                >
                  <span className="nav-icon-container"><IoHome className="menu-icon-svg" /></span>
                  {isSidebarOpen && <span className="menu-title">Dashboard</span>}
                </Nav.Link>
              </Link>
            </Nav.Item>
            
            {/* Application Process with Steps */}
            <Nav.Item>
              <div 
                className={`sidebar-nav-link ${pathname.startsWith("/applications") ? "active" : ""}`}
                onClick={(e) => {
                  toggleAppDropdown(e);
                  router.push("/applications");
                }}
                style={{ cursor: 'pointer' }}
                title={!isSidebarOpen ? "My Application" : undefined}
              >
                <span className="nav-icon-container">
                  <IoDocumentText className="menu-icon-svg" />
                </span>
                {isSidebarOpen && <span className="menu-title">My Application</span>}
                {isSidebarOpen && (
                  <span className="ms-auto">
                    {isAppDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                )}
              </div>
              
              {isSidebarOpen && (
                <div className={`app-steps-dropdown ${isAppDropdownOpen ? 'show' : 'hide'}`}>
                  {applicationSteps.map((step, idx) => (
                    <div key={idx} className="app-step-wrapper">
                      <Link href={step.isDisabled ? '#' : step.path} passHref legacyBehavior>
                        <Nav.Link 
                          className={`app-step-link ${
                            step.path === pathname ? "active" : ""
                          } ${step.isDisabled ? "disabled" : ""} ${step.step === activeAppStep ? "current-step" : ""}`}
                          onClick={(e) => {
                            if (step.isDisabled) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          <span className="step-icon-container">{step.icon}</span>
                          <span className="step-title">{step.title}</span>
                          {step.isCompleted && (
                            <span className="ms-auto completed-icon">
                              <IoIosCheckmarkCircle className="text-success" />
                            </span>
                          )}
                        </Nav.Link>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Nav.Item>
            
            {menuItems.slice(1).map((item, index) => (
              <Nav.Item key={index}>
                <Link href={item.path} passHref legacyBehavior>
                  <Nav.Link 
                    className={`sidebar-nav-link ${pathname === item.path ? "active" : ""}`}
                    title={!isSidebarOpen ? item.title : undefined}
                  >
                    <span className="nav-icon-container">{item.icon}</span>
                    {isSidebarOpen && <span className="menu-title">{item.title}</span>}
                    {item.badge && (
                      <Badge bg="primary" pill className={isSidebarOpen ? "ms-auto pulse-badge" : "badge-collapsed pulse-badge"}>
                        {item.badge}
                      </Badge>
                    )}
                  </Nav.Link>
                </Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        
        <div className="sidebar-footer mt-auto">
          <Button 
            variant="link" 
            className="sidebar-nav-link text-dark logout-btn px-3 py-2 w-100 text-start"
            onClick={handleLogout}
          >
            <span className="nav-icon-container"><IoIosLogOut /></span>
            {isSidebarOpen && <span className="menu-title">Logout</span>}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --primary-blue: #1A73E8;
          --primary-dark: #0D47A1;
          --primary-light: #E8F0FE;
          --blue-hover: #4285F4;
          --blue-active: #1967D2;
          --teal: #00ACC1;
          --teal-light: #E0F7FA;
          --text-color: #1E293B;
        }
        
        .sidebar-wrapper {
          height: 100vh;
          transition: width 0.3s ease;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1030;
        }
        
        .expanded {
          width: 260px;
        }
        
        .collapsed {
          width: 70px;
        }
        
        .sidebar-container {
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(0, 0, 0, 0.08);
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
        
        .sidebar-container::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-container::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        .sidebar-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .logo-container {
          overflow: hidden;
          height: 44px;
          display: flex;
          align-items: center;
        }
        
        .sidebar-logo {
          max-height: 48px !important;
          width: auto !important;
          object-fit: contain;
        }
        
        .app-icon {
          width: 40px;
          height: 40px;
          font-size: 14px;
        }
        
        .toggle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: linear-gradient(135deg, var(--primary-blue), var(--teal));
          transition: all 0.3s ease;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .toggle-btn:hover {
          transform: rotate(360deg) scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
        }
        
        .toggle-btn:active {
          transform: scale(0.95);
        }
        
        .toggle-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(45deg);
          transition: all 0.5s ease;
          opacity: 0;
        }
        
        .toggle-btn:hover::before {
          opacity: 1;
          transform: rotate(45deg) translateY(-10%);
        }
        
        .user-profile-section {
          background-color: var(--primary-light);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .profile-avatar {
          width: 40px;
          height: 40px;
          font-size: 18px;
          font-weight: 600;
        }
        
        .sidebar-menu {
          flex: 1;
          overflow-y: auto;
        }
        
        .sidebar-nav-link {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          color: var(--text-color);
          transition: all 0.2s ease;
          border-radius: 0;
          margin: 2px 6px;
          border-radius: 8px;
          position: relative;
        }
        
        .sidebar-nav-link:hover {
          background-color: var(--primary-light);
          color: var(--blue-hover);
          transform: translateX(5px);
        }
        
        .sidebar-nav-link.active {
          background-color: var(--primary-light);
          color: var(--blue-active);
          font-weight: 500;
          position: relative;
        }
        
        .sidebar-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, var(--primary-blue), var(--teal));
          border-radius: 0 4px 4px 0;
        }
        
        .nav-icon-container {
          font-size: 20px;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: ${isSidebarOpen ? '12px' : '0'};
          transition: all 0.2s ease;
          color: var(--text-color);
          opacity: 0.9;
        }
        
        .sidebar-nav-link:hover .nav-icon-container {
          color: var(--blue-hover);
          opacity: 1;
          transform: scale(1.1);
        }
        
        .sidebar-nav-link.active .nav-icon-container {
          color: var(--blue-active);
          opacity: 1;
        }
        
        .menu-icon-svg {
          font-size: 21px;
        }
        
        .menu-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-color);
        }
        
        .badge-collapsed {
          position: absolute;
          top: 6px;
          right: 6px;
          font-size: 8px;
          padding: 3px 5px;
        }
        
        .sidebar-footer {
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          background-color: #FBFBFB;
        }
        
        .logout-btn {
          color: var(--text-color) !important;
        }
        
        .mobile-menu-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1029;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-dark));
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
        
        .mobile-menu-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
        }
        
        .gradient-blue {
          background: linear-gradient(135deg, var(--primary-blue), var(--primary-dark));
        }
        
        .user-profile-card {
          background-color: var(--primary-light);
        }
        
        .pulse-badge {
          background: linear-gradient(135deg, var(--teal), var(--primary-blue)) !important;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(26, 115, 232, 0.5);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(26, 115, 232, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(26, 115, 232, 0);
          }
        }
        
        .sidebar-offcanvas {
          width: 280px !important;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
        }
        
        .rounded-lg {
          border-radius: 8px;
        }
        
        @media (max-width: 991px) {
          .sidebar-wrapper {
            display: none;
          }
        }
        
        /* Application Steps Styles */
        .app-steps-dropdown {
          background-color: rgba(0, 0, 0, 0.02);
          border-left: 3px solid var(--primary-light);
          margin-left: 20px;
          margin-right: 10px;
          border-radius: 0 0 8px 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .app-steps-dropdown.show {
          max-height: 500px; /* Set a large enough value to accommodate all items */
          opacity: 1;
          visibility: visible;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        
        .app-steps-dropdown.hide {
          max-height: 0;
          opacity: 0;
          visibility: hidden;
          padding-top: 0;
          padding-bottom: 0;
        }
        
        .app-step-link {
          padding: 8px 12px 8px 20px !important;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .app-step-link.disabled {
          opacity: 0.6;
          cursor: not-allowed !important;
        }
        
        .app-step-link.current-step {
          background-color: var(--primary-light);
          font-weight: 500;
        }
        
        .step-icon-container {
          font-size: 16px;
          margin-right: 10px;
          width: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .completed-icon {
          font-size: 18px;
        }
        
        .app-step-link.active {
          background-color: var(--primary-light) !important;
          color: var(--blue-active) !important;
          font-weight: 500 !important;
          position: relative;
        }
        
        .app-step-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, var(--primary-blue), var(--teal));
          border-radius: 0 4px 4px 0;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;

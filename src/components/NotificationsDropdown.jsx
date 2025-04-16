'use client';

import { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  const dropdownRef = useRef(null);
  
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Application Submitted',
      message: 'Your application has been successfully submitted.',
      time: '2 hours ago',
      icon: <FaCheckCircle />
    },
    {
      id: 2,
      type: 'info',
      title: 'Document Update',
      message: 'New documents are available for your review.',
      time: '1 day ago',
      icon: <FaInfoCircle />
    }
  ];
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const dismissNotification = (id) => {
    // In a real app, you'd make an API call to mark as read
    setNotificationCount(prevCount => Math.max(0, prevCount - 1));
  };
  
  const clearAllNotifications = () => {
    setNotificationCount(0);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="notifications-container" ref={dropdownRef}>
      <button 
        className="notifications-button" 
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <FaBell className="bell-icon" />
        {notificationCount > 0 && (
          <span className="notifications-badge">{notificationCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notificationCount > 0 && (
              <button 
                className="clear-all-button"
                onClick={clearAllNotifications}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.type}`}
                >
                  <div className="notification-icon">
                    {notification.icon}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  <button 
                    className="dismiss-button"
                    onClick={() => dismissNotification(notification.id)}
                    aria-label="Dismiss notification"
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-notifications">
                <p>No notifications at this time</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .notifications-container {
          position: relative;
        }
        
        .notifications-button {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .notifications-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .bell-icon {
          font-size: 20px;
          color: #4a5568;
        }
        
        .notifications-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #e53e3e;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .notifications-dropdown {
          position: absolute;
          top: 45px;
          right: 0;
          width: 320px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 100;
          overflow: hidden;
          animation: slideDown 0.2s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .notifications-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
        }
        
        .clear-all-button {
          background: none;
          border: none;
          font-size: 13px;
          color: #4a6baf;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .clear-all-button:hover {
          background-color: #f7fafc;
          text-decoration: underline;
        }
        
        .notifications-list {
          max-height: 350px;
          overflow-y: auto;
        }
        
        .notification-item {
          display: flex;
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
          position: relative;
          transition: background-color 0.2s;
        }
        
        .notification-item:hover {
          background-color: #f7fafc;
        }
        
        .notification-item:last-child {
          border-bottom: none;
        }
        
        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }
        
        .notification-item.success .notification-icon {
          background-color: rgba(72, 187, 120, 0.1);
          color: #48bb78;
        }
        
        .notification-item.info .notification-icon {
          background-color: rgba(90, 103, 216, 0.1);
          color: #5a67d8;
        }
        
        .notification-item.warning .notification-icon {
          background-color: rgba(237, 137, 54, 0.1);
          color: #ed8936;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-title {
          font-weight: 600;
          font-size: 14px;
          color: #2d3748;
          margin-bottom: 4px;
        }
        
        .notification-message {
          font-size: 13px;
          color: #718096;
          line-height: 1.4;
          margin-bottom: 4px;
        }
        
        .notification-time {
          font-size: 12px;
          color: #a0aec0;
        }
        
        .dismiss-button {
          background: none;
          border: none;
          position: absolute;
          top: 12px;
          right: 12px;
          color: #a0aec0;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s, background-color 0.2s;
        }
        
        .notification-item:hover .dismiss-button {
          opacity: 1;
        }
        
        .dismiss-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #718096;
        }
        
        .empty-notifications {
          padding: 30px 15px;
          text-align: center;
          color: #a0aec0;
        }
        
        @media (max-width: 640px) {
          .notifications-dropdown {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            width: 100%;
            border-radius: 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
} 
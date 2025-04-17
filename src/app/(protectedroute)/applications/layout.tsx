"use client"
import Sidebar from '@/components/Sidebar';
import Header from "@/components/Header";

export default function ApplicationsLayout({ children }) {
  return (
    <div className="layout">
      {/* <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content"> */}
          {children}  
        {/* </div>
      </div> */}
    </div>
  );
}

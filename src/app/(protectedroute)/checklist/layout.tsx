"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          {children}{" "}
          {/* This will render the page content (e.g. Dashboard data) */}
        </div>
      </div>
    </div>
  );
}

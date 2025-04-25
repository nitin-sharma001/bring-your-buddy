"use client"

export default function ApplicationsLayout({ children }: any) {
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

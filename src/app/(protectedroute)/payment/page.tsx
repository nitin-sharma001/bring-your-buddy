"use client"

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Badge } from "react-bootstrap";



export default function PaymentsTable() {

  const [payments, setPayments] = useState({
    id: "PAY12345",
    university: "",
    program: "",
    payDate: "2025-03-25",
    amount: "₹5000",
    status: "",
  });

  const [program, setProgram] = useState("")
  const [university, setUniversity] = useState("");
  const [status, setStatus]= useState(false);

  useEffect(() => {
      const university = localStorage.getItem("university_name");
      setUniversity(university);

      const program = localStorage.getItem("program_name");
      setProgram(program);

      const email = JSON.parse(localStorage.getItem("user")).email;
      axios.post("/api/payment/getpaymentinfo", {
        email: email,
      })
      .then((response) => {

        console.log("Payment status response:", response.data);

        if(response.data.data.payment_status === 1){
        setStatus(true);
        }else{
          setStatus(false);
        }
      }
      )
      .catch((error) => {
        console.error("Error fetching payment status:", error);
        setStatus(false);

      }
      );

  }, [])


  return (
    <div className="container mt-4">
      <h3 className="mb-3">User Payments</h3>
      <Table striped bordered hover responsive>
        <thead className="table-danger">
          <tr>
            <th>Payment ID</th>
            <th>University</th>
            <th>Program</th>
            <th>Pay Date</th>
            <th>Paid Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>{payments?.id}</td>
              <td>{university}</td>
              <td>{program}</td>
              <td>{payments?.payDate}</td>
              <td>{payments?.amount}</td>
              <td>
                <Badge
                  bg={
                    status 
                      ? "success": "danger"
                  }
                >
                  {status ? "Completed" : "Pending"}
                </Badge>
              </td>
            </tr>
  
        </tbody>
      </Table>
    </div>
  );
}

"use client"
import useAuth from "../../../utils/auth";

export default function AuthLayout({children}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null; 

  return (
      <div>{children}</div>

  );
}

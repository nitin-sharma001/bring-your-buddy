"use client"; // if using Next.js App Router

import { createContext, useContext, useState } from "react";

const defaultUser = {
  id : "",
  name: "",
  email: "",
  profile_img: "",
  phone_number: "",
};

const UserContext = createContext({
  user: defaultUser,
  setUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [usercontext, setUserContext] = useState(defaultUser);

  return (
    <UserContext.Provider value={{ usercontext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier usage
export const useUser = () => useContext(UserContext);

"use client";

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

export const UserProvider = ({ children }  : any ) => {
  const [usercontext, setUserContext] = useState(defaultUser);
  const [application_submitted_status, setAppSubmitted] = useState(false);
  const [offer_letter_status, setOfferLetterStatus] = useState(false);
  const [payent_completed_status, setPaymentCompletedStatus] = useState(false);
  const [doc_verification_status, setDocVerification] = useState(false);

  return (
    <UserContext.Provider
      value={{
        usercontext,
        setUserContext,
        application_submitted_status,
        setAppSubmitted,
        offer_letter_status,
        setOfferLetterStatus,
        payent_completed_status,
        setPaymentCompletedStatus,
        doc_verification_status,
        setDocVerification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);

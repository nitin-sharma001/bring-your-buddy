"use client";

import { createContext, useContext, useState } from "react";

const defaultUser = {
  id : "",
  name: "",
  email: "",
  profile_img: "",
  phone_number: "",
};

interface UserContextType {
  usercontext: typeof defaultUser;
  setUserContext: React.Dispatch<React.SetStateAction<typeof defaultUser>>;
  application_submitted_status: boolean;
  setAppSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  offer_letter_status: boolean;
  setOfferLetterStatus: React.Dispatch<React.SetStateAction<boolean>>;
  payent_completed_status: boolean;
  setPaymentCompletedStatus: React.Dispatch<React.SetStateAction<boolean>>;
  doc_verification_status: boolean;
  setDocVerification: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType>({
  usercontext: defaultUser,
  setUserContext: () => {},
  application_submitted_status: false,
  setAppSubmitted: () => {},
  offer_letter_status: false,
  setOfferLetterStatus: () => {},
  payent_completed_status: false,
  setPaymentCompletedStatus: () => {},
  doc_verification_status: false,
  setDocVerification: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
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

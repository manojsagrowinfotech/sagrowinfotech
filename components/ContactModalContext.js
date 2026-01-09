"use client";

import { createContext, useContext, useState } from "react";
import ContactModal from "./ContactModal";

const ContactModalContext = createContext(null);

export function ContactModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeModal} showButton={false} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    // Return a no-op function if context is not available (for graceful degradation)
    return { openModal: () => {}, closeModal: () => {} };
  }
  return context;
}

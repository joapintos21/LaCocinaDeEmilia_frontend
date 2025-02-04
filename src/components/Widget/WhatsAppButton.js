import React from "react";
import styled from "styled-components";
import { RiWhatsappFill } from "react-icons/ri";

const FloatingButton = styled.a`
  position: fixed;
  bottom: 24px; /* Equivalente a bottom-6 */
  right: 24px;  /* Equivalente a right-6 */
  background-color: #25d366; /* Color oficial de WhatsApp */
  color: white;
  padding: 16px;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
  }
`;

const WhatsAppButton = () => {
  return (
    <FloatingButton
      href="https://api.whatsapp.com/send/?phone=59898576439&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
    >
      <RiWhatsappFill size={32} />
    </FloatingButton>
  );
};

export default WhatsAppButton;

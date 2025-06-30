import { useState } from "react";

export const useModalState = () => {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const openModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const closeAllModals = () => {
    setModals({});
  };

  const isModalOpen = (modalName: string) => {
    return modals[modalName] || false;
  };

  return {
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
  };
};

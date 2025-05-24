import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  name?: string;
  submitButtonText?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  name,
  inputValue,
  onInputChange,
  onSubmit,
  submitButtonText,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <Button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        {children ? (
          children
        ) : (
          <>
            <Input
              value={inputValue}
              onChange={onInputChange}
              className="mb-4 w-full"
            />
            <div className="flex justify-end">
              <Button
                buttonText={submitButtonText}
                onClick={onSubmit}
                className="bg-blue-600 px-4 text-white hover:bg-blue-700 active:bg-blue-800"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;

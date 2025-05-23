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
      className="fixed inset-0 bg-opacity-30 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white border rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{name}</h3>
          <Button onClick={onClose} className=" cursor-pointer">
            X
          </Button>
        </div>
        {children ? (
          children
        ) : (
          <>
            <Input
              value={inputValue}
              onChange={onInputChange}
              className="w-full mb-4"
            />
            <div className="flex justify-end">
              <Button
                buttonText={submitButtonText}
                onClick={onSubmit}
                className="px-4"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;

import React from "react";

interface ButtonProps {
  onClick: () => void;
  className?: string;
  buttonText?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  buttonText = "Submit",
  className,
  children,
  disabled,
}) => (
  <button
    className={`text-md border rounded-md px-2 py-2 cursor-pointer hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children || buttonText}
  </button>
);

export default Button;

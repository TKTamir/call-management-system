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
    className={`text-sm font-medium rounded-md px-3 py-2 transition-all duration-200 cursor-pointer 
      hover:shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 
      disabled:active:scale-100 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children || buttonText}
  </button>
);

export default Button;

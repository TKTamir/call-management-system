import React from "react";

interface ButtonProps {
  onClick: () => void;
  className?: string;
  buttonText?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  buttonText = "Submit",
  className,
  children,
}) => (
  <button
    className={`text-md hover:bg-gray-200 border rounded-md px-2 py-2 cursor-pointer ${className}`}
    onClick={onClick}
  >
    {children || buttonText}
  </button>
);

export default Button;

import React from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  onChange,
  className,
}) => (
  <input
    type="text"
    placeholder={placeholder}
    className={`rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 
      placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 
      focus:ring-blue-400 focus:ring-opacity-20 ${className}`}
    value={value}
    onChange={onChange}
  />
);

export default Input;

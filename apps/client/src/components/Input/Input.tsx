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
    className={`border rounded-md px-3 py-2 ${className}`}
    value={value}
    onChange={onChange}
  />
);

export default Input;

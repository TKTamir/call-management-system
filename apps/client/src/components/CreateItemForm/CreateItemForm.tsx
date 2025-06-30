import React from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

interface CreateItemFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonText: string;
  isLoading: boolean;
}

const CreateItemForm: React.FC<CreateItemFormProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonText,
  isLoading,
}) => {
  return (
    <div className="mb-6 flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-grow"
      />
      <Button
        onClick={onSubmit}
        buttonText={isLoading ? "Adding..." : buttonText}
        disabled={isLoading}
        className="bg-blue-600 px-6 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
      />
    </div>
  );
};

export default CreateItemForm;

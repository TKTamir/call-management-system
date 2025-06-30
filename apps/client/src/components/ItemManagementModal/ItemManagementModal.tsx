import React from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

interface ItemManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemName: string;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onUpdate: () => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  children?: React.ReactNode;
}

const ItemManagementModal: React.FC<ItemManagementModalProps> = ({
  isOpen,
  onClose,
  title,
  itemName,
  editingName,
  onEditingNameChange,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={title}
      inputValue=""
      onInputChange={() => {}}
      onSubmit={() => {}}
      submitButtonText=""
    >
      <div className="space-y-6">
        <div className={children ? "border-b border-gray-200 pb-6" : ""}>
          <h4 className="mb-3 font-semibold text-gray-900">
            Edit {title.includes("Tag") ? "Tag" : "Task"} Name:
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={`${title.includes("Tag") ? "Tag" : "Task"} name`}
              disabled={isUpdating}
            />
            <Button
              buttonText={isUpdating ? "Saving..." : "Save"}
              onClick={onUpdate}
              disabled={
                isUpdating ||
                !editingName.trim() ||
                editingName.trim() === itemName
              }
              className="bg-blue-600 px-4 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300"
            />
          </div>
        </div>

        {children}

        <div className="flex flex-row justify-center mt-6">
          <Button
            buttonText={isDeleting ? "Deleting..." : "Delete"}
            onClick={onDelete}
            className="bg-red-600 align-self-end text-white shadow-sm hover:bg-red-700 active:bg-red-800"
            disabled={isDeleting}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ItemManagementModal;

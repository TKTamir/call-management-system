import React from "react";
import Button from "../Button/Button";
import { type Call } from "../../types";

interface SidebarProps {
  calls: Call[];
  selectedCall: Call | undefined;
  handleSelectCall: (call: Call) => void;
  showCallModal: boolean;
  setShowCallModal: (show: boolean) => void;
  newCallName: string;
  setNewCallName: (name: string) => void;
  handleAddCall: () => void;
  isCreatingCall: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  calls,
  selectedCall,
  handleSelectCall,
  setShowCallModal,
  isCreatingCall,
}) => {
  return (
    <div className="flex flex-col w-full h-full sm:w-1/3 sm:h-auto overflow-y-auto border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Calls</h2>
        <Button
          buttonText={isCreatingCall ? "Creating..." : "New"}
          onClick={() => setShowCallModal(true)}
          disabled={isCreatingCall}
          className="px-4"
        />
      </div>

      <div className="space-y-2 flex-grow">
        {calls.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No calls available.</p>
        ) : (
          calls.map((call) => (
            <Button
              key={call.id}
              onClick={() => handleSelectCall(call)}
              className={`w-full border rounded-md px-4 py-4 cursor-pointer text-left ${
                selectedCall?.id === call.id
                  ? "bg-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              {call.name}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;

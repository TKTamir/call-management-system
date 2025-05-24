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
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-gray-50 p-4 shadow-sm sm:h-auto sm:w-1/3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Calls</h2>
        <Button
          buttonText={isCreatingCall ? "Creating..." : "New"}
          onClick={() => setShowCallModal(true)}
          disabled={isCreatingCall}
          className="bg-blue-600 px-4 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
        />
      </div>

      <div className="flex-grow space-y-2 overflow-y-auto">
        {calls.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No calls available.</p>
        ) : (
          calls.map((call) => (
            <Button
              key={call.id}
              onClick={() => handleSelectCall(call)}
              className={`w-full rounded-lg px-4 py-3 text-left transition-all ${
                selectedCall?.id === call.id
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md"
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

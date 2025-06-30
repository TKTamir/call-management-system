import React from "react";
import Button from "../Button/Button";

interface ViewToggleProps {
  activeView: string;
  views: Array<{ key: string; label: string }>;
  onViewChange: (view: "tags" | "suggestedTasks") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  activeView,
  views,
  onViewChange,
}) => {
  return (
    <div className="mb-4 flex items-center justify-end gap-2">
      {views.map(({ key, label }) => (
        <Button
          key={key}
          buttonText={label}
          onClick={() => onViewChange(key as "tags" | "suggestedTasks")}
          className={`px-4 py-2 font-medium transition-all ${
            activeView === key
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default ViewToggle;

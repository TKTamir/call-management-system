import React from "react";

interface SuggestedTaskItemProps {
  name: string;
  className?: string;
}

const SuggestedTaskItem: React.FC<SuggestedTaskItemProps> = ({
  name,
  className,
}) => (
  <div className={`flex items-center text-gray-700 ${className}`}>
    <span className="font-medium">{name}</span>
  </div>
);

export default SuggestedTaskItem;

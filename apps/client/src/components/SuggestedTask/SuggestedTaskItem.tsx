import React from "react";

interface SuggestedTaskItemProps {
  name: string;
  className?: string;
}

const SuggestedTaskItem: React.FC<SuggestedTaskItemProps> = ({
  name,
  className,
}) => (
  <div className={`flex items-center ${className}`}>
    <span>{name}</span>
  </div>
);

export default SuggestedTaskItem;

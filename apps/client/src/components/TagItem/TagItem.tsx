import React from "react";

interface TagItemProps {
  name: string;
  className?: string;
  highlightIcon?: boolean;
}

const TagItem: React.FC<TagItemProps> = ({
  name,
  className,
  highlightIcon = false,
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span>{name}</span>
      {highlightIcon && <span className="ml-2 text-yellow-500">✏️</span>}
    </div>
  );
};

export default TagItem;

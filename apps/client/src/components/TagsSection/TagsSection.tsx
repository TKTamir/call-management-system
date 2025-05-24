import React from "react";
import Button from "../Button/Button";
import TagItem from "../TagItem/TagItem";
import type { Tag } from "../../types";

interface TagsSectionProps {
  tags: Tag[];
  setShowTagModal: (show: boolean) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({ tags, setShowTagModal }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-4 shadow-sm">
        <h4 className="mr-2 text-sm font-semibold text-gray-700">Tags</h4>
        {tags.map((tag) => (
          <TagItem
            key={tag.id}
            name={tag.name}
            className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
          />
        ))}
        <Button
          buttonText="+"
          onClick={() => setShowTagModal(true)}
          className="rounded-full bg-white px-3 py-1 text-lg font-medium text-blue-600 shadow-sm hover:bg-blue-50 hover:shadow-md"
        />
      </div>
    </div>
  );
};

export default TagsSection;

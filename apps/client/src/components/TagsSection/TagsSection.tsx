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
    <div className="mb-4">
      <div className="flex flex-wrap items-center p-3 border rounded-lg gap-2">
        <h4 className="text-sm font-medium mr-2">Tags</h4>
        {tags.map((tag) => (
          <TagItem
            key={tag.id}
            name={tag.name}
            className="border rounded-md px-3 py-1 text-sm"
          />
        ))}
        <Button
          buttonText="+"
          onClick={() => setShowTagModal(true)}
          className="border-0 text-lg"
        />
      </div>
    </div>
  );
};

export default TagsSection;

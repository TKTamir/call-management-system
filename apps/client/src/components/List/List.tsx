import React from "react";
import TagItem from "../TagItem/TagItem";
import Button from "../Button/Button";
import SuggestedTaskItem from "../SuggestedTask/SuggestedTaskItem";
import type { Tag } from "../../types";

interface SuggestedTask {
  id: number;
  name: string;
}

interface ListProps {
  variant: "tags" | "suggestedTasks";
  tags?: Tag[];
  suggestedTasks?: SuggestedTask[];
  highlightIcon?: boolean;
  headingText?: string;
  onTagClick?: (tag: Tag) => void;
}

const List: React.FC<ListProps> = ({
  variant,
  tags,
  suggestedTasks,
  highlightIcon = false,
  onTagClick,
}) => {
  return (
    <>
      {variant === "tags" ? (
        <>
          <h2 className="text-xl font-medium mb-4">Tags</h2>
          <div className="flex flex-col flex-grow overflow-auto space-y-2 border rounded-lg p-4">
            {tags?.map((tag) => (
              <Button
                key={tag.id}
                onClick={() => onTagClick?.(tag)}
                children={
                  <TagItem
                    className="p-3"
                    name={tag.name}
                    highlightIcon={highlightIcon}
                  />
                }
              />
            ))}
            {tags?.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No tags available.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-medium mb-4">Suggested Tasks</h2>
          <div className="flex flex-col flex-grow overflow-auto space-y-2 border rounded-lg p-4">
            {suggestedTasks?.map((suggestedTask) => (
              <Button
                key={suggestedTask.id}
                onClick={() => {}}
                children={
                  <SuggestedTaskItem
                    className="p-3"
                    name={suggestedTask.name}
                  />
                }
              />
            ))}
            {suggestedTasks?.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No suggested tasks available.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default List;

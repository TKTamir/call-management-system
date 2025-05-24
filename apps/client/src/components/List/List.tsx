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
          <div className="flex flex-grow flex-col space-y-2 overflow-auto rounded-lg bg-gray-50 p-4 shadow-sm">
            {tags?.map((tag) => (
              <Button
                key={tag.id}
                onClick={() => onTagClick?.(tag)}
                className="w-full rounded-lg bg-white p-4 text-left shadow-sm transition-all hover:bg-blue-50 hover:shadow-md active:bg-blue-100"
              >
                <TagItem name={tag.name} highlightIcon={highlightIcon} />
              </Button>
            ))}
            {tags?.length === 0 && (
              <div className="flex h-32 items-center justify-center">
                <p className="text-gray-500">No tags available.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-grow flex-col space-y-2 overflow-auto rounded-lg bg-gray-50 p-4 shadow-sm">
            {suggestedTasks?.map((suggestedTask) => (
              <Button
                key={suggestedTask.id}
                onClick={() => {}}
                className="w-full rounded-lg bg-white p-4 text-left shadow-sm transition-all hover:bg-blue-50 hover:shadow-md active:bg-blue-100"
              >
                <SuggestedTaskItem name={suggestedTask.name} />
              </Button>
            ))}
            {suggestedTasks?.length === 0 && (
              <div className="flex h-32 items-center justify-center">
                <p className="text-gray-500">No suggested tasks available.</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default List;

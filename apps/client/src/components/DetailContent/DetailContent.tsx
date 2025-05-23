import React from "react";
import TagsSection from "../TagsSection/TagsSection";
import TasksSection from "../TasksSection/TasksSection";
import type { Call, Tag, CallTask } from "../../types";

interface DetailContentProps {
  selectedCall: Call | undefined;
  tags: Tag[];
  tasks: CallTask[];
  setShowTagModal: (show: boolean) => void;
  setShowTaskModal: (show: boolean) => void;
  setShowSuggestedTasksModal: (show: boolean) => void;
  suggestedTasksCount: number;
}

const DetailContent: React.FC<DetailContentProps> = ({
  selectedCall,
  tags,
  tasks,
  setShowTagModal,
  setShowTaskModal,
  setShowSuggestedTasksModal,
  suggestedTasksCount,
}) => {
  if (!selectedCall) {
    return (
      <div className="border rounded-lg p-4 w-full sm:w-2/3 h-full flex items-center justify-center">
        <p className="text-gray-500">Select a call to view details</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 w-full sm:w-2/3 h-full overflow-auto">
      <div className="h-full flex flex-col">
        <h3 className="text-lg font-medium mb-2">{selectedCall.name}</h3>
        <TagsSection tags={tags} setShowTagModal={setShowTagModal} />
        <TasksSection
          callId={selectedCall.id}
          tasks={tasks}
          setShowTaskModal={setShowTaskModal}
          setShowSuggestedTasksModal={setShowSuggestedTasksModal}
          suggestedTasksCount={suggestedTasksCount}
        />
      </div>
    </div>
  );
};

export default DetailContent;

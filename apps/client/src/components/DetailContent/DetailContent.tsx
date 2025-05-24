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
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-50 p-4 shadow-sm sm:w-2/3">
        <p className="text-gray-500">Select a call to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto rounded-lg bg-white p-6 shadow-sm sm:w-2/3">
      <div className="flex h-full flex-col">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          {selectedCall.name}
        </h3>
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

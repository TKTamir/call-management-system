import React, { useState, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import Sidebar from "../components/Sidebar/Sidebar";
import MainContent from "../components/MainContent/MainContent";
import DetailContent from "../components/DetailContent/DetailContent";
import Container from "../components/Container/Container";
import SuggestedTaskItem from "../components/SuggestedTask/SuggestedTaskItem";
import {
  useGetAllCallsQuery,
  useGetAllTagsQuery,
  useCreateCallMutation,
  useGetCallTasksQuery,
  useGetCallTagsQuery,
  useAddTagsToCallMutation,
  useAddTaskToCallMutation,
  useGetSuggestedTasksForTagsMutation,
} from "../store/api";
import type { Call } from "../types";
import { useErrorHandler } from "../hooks/useErrorHandler";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Button from "../components/Button/Button";

const Dashboard: React.FC = () => {
  const {
    data: calls = [],
    isLoading: callsLoading,
    error: callsError,
  } = useGetAllCallsQuery();
  const { data: allTags = [], error: tagsError } = useGetAllTagsQuery();

  const [createCall, { isLoading: isCreatingCall, error: createCallError }] =
    useCreateCallMutation();
  const [addTagsToCall, { isLoading: isAddingTags }] =
    useAddTagsToCallMutation();
  const [addTaskToCall, { isLoading: isAddingTask }] =
    useAddTaskToCallMutation();
  const [getSuggestedTasksForTags, { data: suggestedTasks = [] }] =
    useGetSuggestedTasksForTagsMutation();

  // Error handling
  useErrorHandler(callsError);
  useErrorHandler(tagsError);
  useErrorHandler(createCallError);

  // ✅ Local state
  const [view, setView] = useState<string>("main");
  const [selectedCall, setSelectedCall] = useState<Call | undefined>(undefined);
  const [newCallName, setNewCallName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");

  // ✅ Modal states
  const [showCallModal, setShowCallModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSuggestedTasksModal, setShowSuggestedTasksModal] = useState(false);

  // Get call-specific data
  const { data: callTasks = [] } = useGetCallTasksQuery(selectedCall?.id || 0, {
    skip: !selectedCall,
  });

  const { data: callTags = [] } = useGetCallTagsQuery(selectedCall?.id || 0, {
    skip: !selectedCall,
  });

  // Get suggested tasks when call tags change
  useEffect(() => {
    if (callTags.length > 0) {
      const tagIds = callTags.map((tag) => tag.id);
      getSuggestedTasksForTags({ tagIds });
    }
  }, [callTags, getSuggestedTasksForTags]);

  const handleSelectCall = (call: Call) => {
    setSelectedCall(call);
    setView("detail");
  };

  const handleAddCall = async () => {
    if (newCallName.trim()) {
      try {
        await createCall({ name: newCallName.trim() }).unwrap();
        setNewCallName("");
        setShowCallModal(false);
      } catch (error) {
        console.error("Failed to create call:", error);
      }
    }
  };

  // Add tags to call
  const handleAddTagToCall = async (tagIds: number[]) => {
    if (!selectedCall || tagIds.length === 0) return;

    try {
      await addTagsToCall({
        callId: selectedCall.id,
        data: { tagIds },
      }).unwrap();
      setShowTagModal(false);
    } catch (error) {
      console.error("Failed to add tags to call:", error);
    }
  };

  // Add custom task to call
  const handleAddCustomTask = async () => {
    if (!selectedCall || !newTaskName.trim()) return;

    try {
      await addTaskToCall({
        callId: selectedCall.id,
        data: {
          taskName: newTaskName.trim(),
          taskStatus: "Open",
        },
      }).unwrap();
      setNewTaskName("");
      setShowTaskModal(false);
    } catch (error) {
      console.error("Failed to add task to call:", error);
    }
  };

  // Add suggested task to call
  const handleAddSuggestedTask = async (taskId: number) => {
    if (!selectedCall) return;

    try {
      await addTaskToCall({
        callId: selectedCall.id,
        data: {
          taskId,
          taskStatus: "Open",
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to add suggested task to call:", error);
    }
  };

  // Check if tag is already added to call
  const isTagAddedToCall = (tagId: number) => {
    return callTags.some((tag) => tag.id === tagId);
  };

  // Check if suggested task is already added to call
  const isTaskAddedToCall = (taskId: number) => {
    return callTasks.some((callTask) => callTask.taskId === taskId);
  };

  if (callsLoading) {
    return <LoadingSpinner fullScreen text="Loading calls..." />;
  }

  return (
    <Container>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full">
        <Sidebar
          calls={calls}
          selectedCall={selectedCall}
          handleSelectCall={handleSelectCall}
          showCallModal={showCallModal}
          setShowCallModal={setShowCallModal}
          newCallName={newCallName}
          setNewCallName={setNewCallName}
          handleAddCall={handleAddCall}
          isCreatingCall={isCreatingCall}
        />

        {view === "main" ? (
          <MainContent />
        ) : (
          <DetailContent
            selectedCall={selectedCall}
            tags={callTags}
            tasks={callTasks}
            setShowTagModal={setShowTagModal}
            setShowTaskModal={setShowTaskModal}
            setShowSuggestedTasksModal={setShowSuggestedTasksModal}
            suggestedTasksCount={suggestedTasks.length}
          />
        )}
      </div>

      {/* Create Call Modal */}
      <Modal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        name="New Call Name"
        inputValue={newCallName}
        onInputChange={(e) => setNewCallName(e.target.value)}
        onSubmit={handleAddCall}
        submitButtonText={isCreatingCall ? "Creating..." : "Add Call"}
      />

      {/* Create Custom Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        name="New Task Name"
        inputValue={newTaskName}
        onInputChange={(e) => setNewTaskName(e.target.value)}
        onSubmit={handleAddCustomTask}
        submitButtonText={isAddingTask ? "Adding..." : "Add Task"}
      />

      {/* Add Tags to Call Modal */}
      <Modal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        name="Add Tags to Call"
        inputValue=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        submitButtonText=""
      >
        <div className="space-y-4">
          <h4 className="font-medium">Available Tags:</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {allTags.map((tag) => (
              <div
                key={tag.id}
                className={`border rounded-md p-3 flex justify-between items-center ${
                  isTagAddedToCall(tag.id) ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <span>{tag.name}</span>
                <Button
                  buttonText={isTagAddedToCall(tag.id) ? "✓ Added" : "Add"}
                  onClick={() => handleAddTagToCall([tag.id])}
                  disabled={isTagAddedToCall(tag.id) || isAddingTags}
                  className={`px-3 py-1 text-sm border rounded ${
                    isTagAddedToCall(tag.id) &&
                    "bg-green-100 text-green-700 cursor-not-allowed"
                  }`}
                />
              </div>
            ))}
          </div>

          {allTags.length === 0 && (
            <p className="text-gray-500 text-center py-4">No tags available.</p>
          )}
        </div>
      </Modal>

      {/* Add Suggested Tasks Modal */}
      <Modal
        isOpen={showSuggestedTasksModal}
        onClose={() => setShowSuggestedTasksModal(false)}
        name="Add Suggested Tasks"
        inputValue=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        submitButtonText=""
      >
        <div className="space-y-4">
          <h4 className="font-medium">Suggested Tasks for this call's tags:</h4>

          {callTags.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Add tags to this call first to see suggested tasks.
            </p>
          ) : suggestedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No suggested tasks available for the selected tags.
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {suggestedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-md p-3 flex justify-between items-center ${
                    isTaskAddedToCall(task.id)
                      ? "bg-green-50 border-green-200"
                      : ""
                  }`}
                >
                  <SuggestedTaskItem name={task.name} />
                  <Button
                    buttonText={isTaskAddedToCall(task.id) ? "✓ Added" : "Add"}
                    onClick={() => handleAddSuggestedTask(task.id)}
                    disabled={isTaskAddedToCall(task.id) || isAddingTask}
                    className={`px-3 py-1 text-sm border rounded ${
                      isTaskAddedToCall(task.id) &&
                      "bg-green-100 text-green-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </Container>
  );
};

export default Dashboard;

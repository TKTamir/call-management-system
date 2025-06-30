import React, { useState, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import Sidebar from "../components/Sidebar/Sidebar";
import MainContent from "../components/MainContent/MainContent";
import DetailContent from "../components/DetailContent/DetailContent";
import Container from "../components/Container/Container";
import SuggestedTaskItem from "../components/SuggestedTask/SuggestedTaskItem";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Button from "../components/Button/Button";
import {
  useGetAllCallsQuery,
  useGetAllTagsQuery,
  useCreateCallMutation,
  useGetCallTasksQuery,
  useGetCallTagsQuery,
  useAddTagsToCallMutation,
  useAddTaskToCallMutation,
  useGetSuggestedTasksForTagsMutation,
  useDeleteCallMutation,
} from "../store/api";
import type { Call } from "../types";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useCrudOperations } from "../hooks/useCrudOperations";
import { useModalState } from "../hooks/useModalState";

const Dashboard: React.FC = () => {
  const {
    data: calls = [],
    isLoading: callsLoading,
    error: callsError,
  } = useGetAllCallsQuery();
  const { data: allTags = [], error: tagsError } = useGetAllTagsQuery();

  const [createCall, { isLoading: isCreatingCall, error: createCallError }] =
    useCreateCallMutation();
  const [deleteCall, { isLoading: isDeletingCall, error: deleteCallError }] =
    useDeleteCallMutation();
  const [addTagsToCall, { isLoading: isAddingTags }] =
    useAddTagsToCallMutation();
  const [addTaskToCall, { isLoading: isAddingTask }] =
    useAddTaskToCallMutation();
  const [getSuggestedTasksForTags, { data: suggestedTasks = [] }] =
    useGetSuggestedTasksForTagsMutation();

  // Custom hooks
  const { executeOperation } = useCrudOperations();
  const { openModal, closeModal, isModalOpen } = useModalState();

  // Error handling
  useErrorHandler(callsError);
  useErrorHandler(tagsError);
  useErrorHandler(createCallError);
  useErrorHandler(deleteCallError);

  // Local state
  const [view, setView] = useState<string>("main");
  const [selectedCall, setSelectedCall] = useState<Call | undefined>(undefined);
  const [newCallName, setNewCallName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");

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

  const handleAddCall = () => {
    if (!newCallName.trim()) return;
    executeOperation(() => createCall({ name: newCallName.trim() }).unwrap(), {
      successMessage: "Call created successfully!",
      onSuccess: () => {
        setNewCallName("");
        closeModal("call");
      },
    });
  };

  const handleDeleteCall = (callId: number) => {
    if (!callId) return;
    executeOperation(() => deleteCall(callId).unwrap(), {
      successMessage: "Call deleted successfully!",
      onSuccess: () => setSelectedCall(undefined),
    });
  };

  const handleAddTagToCall = (tagIds: number[]) => {
    if (!selectedCall || tagIds.length === 0) return;
    executeOperation(
      () =>
        addTagsToCall({ callId: selectedCall.id, data: { tagIds } }).unwrap(),
      {
        successMessage: "Tag added to call successfully!",
        onSuccess: () => closeModal("tag"),
      },
    );
  };

  const handleAddCustomTask = () => {
    if (!selectedCall || !newTaskName.trim()) return;
    executeOperation(
      () =>
        addTaskToCall({
          callId: selectedCall.id,
          data: { taskName: newTaskName.trim(), taskStatus: "Open" },
        }).unwrap(),
      {
        successMessage: "Task added successfully!",
        onSuccess: () => {
          setNewTaskName("");
          closeModal("task");
        },
      },
    );
  };

  const handleAddSuggestedTask = (taskId: number) => {
    if (!selectedCall) return;
    executeOperation(
      () =>
        addTaskToCall({
          callId: selectedCall.id,
          data: { taskId, taskStatus: "Open" },
        }).unwrap(),
      { successMessage: "Suggested task added successfully!" },
    );
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
      <div className="flex h-full flex-col gap-4 sm:flex-row sm:gap-6">
        <Sidebar
          calls={calls}
          selectedCall={selectedCall}
          handleSelectCall={handleSelectCall}
          showCallModal={isModalOpen("call")}
          setShowCallModal={(show) =>
            show ? openModal("call") : closeModal("call")
          }
          newCallName={newCallName}
          setNewCallName={setNewCallName}
          handleAddCall={handleAddCall}
          isCreatingCall={isCreatingCall}
        />

        {view === "main" ? (
          <MainContent />
        ) : (
          <DetailContent
            handleDeleteCall={handleDeleteCall}
            isDeletingCall={isDeletingCall}
            selectedCall={selectedCall}
            tags={callTags}
            tasks={callTasks}
            setShowTagModal={(show) =>
              show ? openModal("tag") : closeModal("tag")
            }
            setShowTaskModal={(show) =>
              show ? openModal("task") : closeModal("task")
            }
            setShowSuggestedTasksModal={(show) =>
              show ? openModal("suggestedTasks") : closeModal("suggestedTasks")
            }
            suggestedTasksCount={suggestedTasks.length}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen("call")}
        onClose={() => closeModal("call")}
        name="New Call Name"
        inputValue={newCallName}
        onInputChange={(e) => setNewCallName(e.target.value)}
        onSubmit={handleAddCall}
        submitButtonText={isCreatingCall ? "Creating..." : "Add Call"}
      />

      <Modal
        isOpen={isModalOpen("task")}
        onClose={() => closeModal("task")}
        name="New Task Name"
        inputValue={newTaskName}
        onInputChange={(e) => setNewTaskName(e.target.value)}
        onSubmit={handleAddCustomTask}
        submitButtonText={isAddingTask ? "Adding..." : "Add Task"}
      />

      <Modal
        isOpen={isModalOpen("tag")}
        onClose={() => closeModal("tag")}
        name="Add Tags to Call"
        inputValue=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        submitButtonText=""
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Available Tags:</h4>
          <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg bg-gray-50 p-3">
            {allTags.map((tag) => (
              <div
                key={tag.id}
                className={`flex items-center justify-between rounded-md p-3 transition-all ${
                  isTagAddedToCall(tag.id)
                    ? "bg-green-50 shadow-sm"
                    : "bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <span className="font-medium text-gray-700">{tag.name}</span>
                <Button
                  buttonText={isTagAddedToCall(tag.id) ? "✓ Added" : "Add"}
                  onClick={() => handleAddTagToCall([tag.id])}
                  disabled={isTagAddedToCall(tag.id) || isAddingTags}
                  className={`px-3 py-1 text-sm font-medium ${
                    isTagAddedToCall(tag.id)
                      ? "cursor-not-allowed bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                />
              </div>
            ))}
          </div>

          {allTags.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="text-gray-500">No tags available.</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen("suggestedTasks")}
        onClose={() => closeModal("suggestedTasks")}
        name="Add Suggested Tasks"
        inputValue=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        submitButtonText=""
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">
            Suggested Tasks for this call's tags:
          </h4>

          {callTags.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                Add tags to this call first to see suggested tasks.
              </p>
            </div>
          ) : suggestedTasks.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                No suggested tasks available for the selected tags.
              </p>
            </div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg bg-gray-50 p-3">
              {suggestedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-md p-3 transition-all ${
                    isTaskAddedToCall(task.id)
                      ? "bg-green-50 shadow-sm"
                      : "bg-white shadow-sm hover:shadow-md"
                  }`}
                >
                  <SuggestedTaskItem name={task.name} />
                  <Button
                    buttonText={isTaskAddedToCall(task.id) ? "✓ Added" : "Add"}
                    onClick={() => handleAddSuggestedTask(task.id)}
                    disabled={isTaskAddedToCall(task.id) || isAddingTask}
                    className={`px-3 py-1 text-sm font-medium ${
                      isTaskAddedToCall(task.id)
                        ? "cursor-not-allowed bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
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

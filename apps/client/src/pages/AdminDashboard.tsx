import React, { useState } from "react";
import { toast } from "react-toastify";
import Container from "../components/Container/Container";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import List from "../components/List/List";
import Modal from "../components/Modal/Modal";
import SuggestedTaskItem from "../components/SuggestedTask/SuggestedTaskItem";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import {
  useGetAllTagsQuery,
  useGetSuggestedTasksQuery,
  useCreateTagMutation,
  useCreateSuggestedTaskMutation,
  useAddSuggestedTaskToTagMutation,
  useGetTagSuggestedTasksQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useUpdateSuggestedTaskMutation,
  useDeleteSuggestedTaskMutation,
} from "../store/api";
import { useErrorHandler } from "../hooks/useErrorHandler";
import type { Tag, Task } from "types";

const AdminDashboard: React.FC = () => {
  // RTK Query hooks
  const {
    data: tags = [],
    isLoading: tagsLoading,
    error: tagsError,
  } = useGetAllTagsQuery();
  const {
    data: suggestedTasks = [],
    isLoading: tasksLoading,
    error: tasksError,
  } = useGetSuggestedTasksQuery();

  const [createTag, { isLoading: isCreatingTag, error: createTagError }] =
    useCreateTagMutation();
  const [deleteTag, { isLoading: isDeletingTag, error: deleteTagError }] =
    useDeleteTagMutation();
  const [deleteTask, { isLoading: isDeletingTask, error: deleteTaskError }] =
    useDeleteSuggestedTaskMutation();
  const [
    createSuggestedTask,
    { isLoading: isCreatingTask, error: createTaskError },
  ] = useCreateSuggestedTaskMutation();
  const [addSuggestedTaskToTag, { isLoading: isLinkingTask }] =
    useAddSuggestedTaskToTagMutation();

  const [updateTag, { isLoading: isUpdatingTag, error: updateTagError }] =
    useUpdateTagMutation();
  const [updateTask, { isLoading: isUpdatingTask, error: updateTaskError }] =
    useUpdateSuggestedTaskMutation();

  // Error handling
  useErrorHandler(tagsError);
  useErrorHandler(tasksError);
  useErrorHandler(createTagError);
  useErrorHandler(deleteTagError);
  useErrorHandler(deleteTaskError);
  useErrorHandler(createTaskError);
  useErrorHandler(updateTagError);
  useErrorHandler(updateTaskError);

  // Local state for UI
  const [activeView, setActiveView] = useState<"tags" | "suggestedTasks">(
    "tags",
  );
  const [newTagName, setNewTagName] = useState<string>("");
  const [newSuggestedTaskName, setNewSuggestedTaskName] = useState<string>("");
  const [editingTagName, setEditingTagName] = useState<string>("");
  const [editingTaskName, setEditingTaskName] = useState<string>("");

  // Modal state for linking suggested tasks to tags
  const [showTasksModal, setShowTasksModal] = useState<boolean>(false);
  const [showLinkTasksModal, setShowLinkTasksModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTagForLinking, setSelectedTagForLinking] =
    useState<Tag | null>(null);

  // Get tasks already linked to selected tag
  const { data: linkedTasks = [] } = useGetTagSuggestedTasksQuery(
    selectedTagForLinking?.id || 0,
    { skip: !selectedTagForLinking },
  );

  const handleTagsClick = () => {
    setActiveView("tags");
  };

  const handleSuggestedTasksClick = () => {
    setActiveView("suggestedTasks");
  };

  // RTK Query mutations
  const handleAddTag = async () => {
    if (newTagName.trim()) {
      try {
        await createTag({ name: newTagName.trim() }).unwrap();
        toast.success("Tag created successfully!");
        setNewTagName("");
      } catch (error) {
        console.error("Failed to create tag:", error);
      }
    }
  };

  const handleDeleteTag = async (tagId?: Tag["id"]) => {
    if (tagId) {
      try {
        await deleteTag(tagId).unwrap();
        toast.success("Tag deleted successfully!");
        setSelectedTagForLinking(null);
        setShowLinkTasksModal(false);
      } catch (error) {
        console.error("Failed to delete call:", error);
      }
    }
  };

  const handleDeleteTask = async (taskId?: Task["id"]) => {
    if (taskId) {
      try {
        await deleteTask(taskId).unwrap();
        toast.success("Task deleted successfully!");
        setSelectedTask(null);
        setShowTasksModal(false);
      } catch (error) {
        console.error("Failed to delete call:", error);
      }
    }
  };

  const handleAddSuggestedTask = async () => {
    if (newSuggestedTaskName.trim()) {
      try {
        await createSuggestedTask({
          name: newSuggestedTaskName.trim(),
        }).unwrap();
        toast.success("Task created successfully!");
        setNewSuggestedTaskName("");
      } catch (error) {
        console.error("Failed to create suggested task:", error);
      }
    }
  };

  // Handle tag click to open link tasks modal
  const handleTagClick = (tag: Tag) => {
    setSelectedTagForLinking(tag);
    setEditingTagName(tag.name);
    setShowLinkTasksModal(true);
  };

  // Handle task click to open tasks modal
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditingTagName(task.name);
    setShowTasksModal(true);
  };

  // Handle tag name update
  const handleUpdateTagName = async () => {
    if (!selectedTagForLinking || !editingTagName.trim()) return;

    if (editingTagName.trim() === selectedTagForLinking.name) return;

    try {
      await updateTag({
        id: selectedTagForLinking.id,
        data: { name: editingTagName.trim() },
      }).unwrap();

      // Update the local state to reflect the change
      setSelectedTagForLinking({
        ...selectedTagForLinking,
        name: editingTagName.trim(),
      });

      toast.success(`Tag renamed to "${editingTagName.trim()}" successfully!`);
    } catch (error) {
      console.error("Failed to update tag name:", error);
    }
  };

  // Handle task name update
  const handleUpdateTaskName = async () => {
    if (!selectedTask || !editingTaskName.trim()) return;

    if (editingTaskName.trim() === selectedTask.name) return;

    try {
      await updateTask({
        id: selectedTask.id,
        data: { name: editingTaskName.trim() },
      }).unwrap();

      // Update the local state to reflect the change
      setSelectedTask(selectedTask);

      toast.success(
        `Task renamed to "${editingTaskName.trim()}" successfully!`,
      );
    } catch (error) {
      console.error("Failed to update task name:", error);
    }
  };

  // Link suggested task to tag
  const handleLinkTaskToTag = async (taskId: number) => {
    if (!selectedTagForLinking) return;

    try {
      await addSuggestedTaskToTag({
        tagId: selectedTagForLinking.id,
        taskId,
      }).unwrap();
      toast.success("Task linked to tag successfully!");
    } catch (error) {
      console.error("Failed to link task to tag:", error);
    }
  };

  const handleCloseModal = () => {
    setShowLinkTasksModal(false);
    setShowTasksModal(false);
    setSelectedTagForLinking(null);
    setSelectedTask(null);
    setEditingTagName("");
    setEditingTaskName("");
  };

  // Check if task is already linked
  const isTaskLinked = (taskId: number) => {
    return linkedTasks.some((task) => task.id === taskId);
  };

  if (tagsLoading || tasksLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  return (
    <>
      <Container>
        <div className="mb-4 flex items-center justify-end gap-2">
          <Button
            buttonText="Tags"
            onClick={handleTagsClick}
            className={`px-4 py-2 font-medium transition-all ${
              activeView === "tags"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          />
          <Button
            buttonText="Tasks"
            onClick={handleSuggestedTasksClick}
            className={`px-4 py-2 font-medium transition-all ${
              activeView === "suggestedTasks"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          />
        </div>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          {activeView === "tags" ? "Tags" : "Suggested Tasks"}
        </h2>

        <div className="mb-6 flex gap-2">
          <Input
            value={activeView === "tags" ? newTagName : newSuggestedTaskName}
            onChange={(e) =>
              activeView === "tags"
                ? setNewTagName(e.target.value)
                : setNewSuggestedTaskName(e.target.value)
            }
            placeholder={activeView === "tags" ? "Tag name" : "Task name"}
            className="min-w-0 flex-grow"
          />
          <Button
            onClick={
              activeView === "tags" ? handleAddTag : handleAddSuggestedTask
            }
            buttonText={
              activeView === "tags"
                ? isCreatingTag
                  ? "Adding..."
                  : "Add Tag"
                : isCreatingTask
                  ? "Adding..."
                  : "Add Task"
            }
            disabled={activeView === "tags" ? isCreatingTag : isCreatingTask}
            className="bg-blue-600 px-6 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
          />
        </div>

        <List
          variant={activeView}
          tags={tags}
          suggestedTasks={suggestedTasks}
          highlightIcon={true}
          onTagClick={handleTagClick}
          onTaskClick={handleTaskClick}
        />
      </Container>

      {/* Modal for editing suggested tasks */}

      <Modal
        isOpen={showTasksModal}
        onClose={handleCloseModal}
        name={`Manage Task: "${selectedTask?.name}"`}
        inputValue=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        submitButtonText=""
      >
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">
              Edit Task Name:
            </h4>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={editingTaskName}
              onChange={(e) => setEditingTaskName(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Task name"
              disabled={isUpdatingTask}
            />
            <Button
              buttonText={isUpdatingTag ? "Saving..." : "Save"}
              onClick={handleUpdateTaskName}
              disabled={
                isUpdatingTag ||
                !editingTaskName.trim() ||
                editingTaskName.trim() === selectedTask?.name
              }
              className="bg-blue-600 px-4 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300"
            />
          </div>
          <div className="flex flex-row justify-center mt-6">
            <Button
              buttonText={isDeletingTask ? "Deleting..." : "Delete"}
              onClick={() => {
                handleDeleteTask(selectedTask?.id);
              }}
              className="bg-red-600 align-self-end text-white shadow-sm hover:bg-red-700 active:bg-red-800"
              disabled={isDeletingTask}
            />
          </div>
        </div>
      </Modal>

      {/* Modal for linking suggested tasks to tags and editing tags */}
      <Modal
        isOpen={showLinkTasksModal}
        onClose={handleCloseModal}
        name={`Manage Tag: "${selectedTagForLinking?.name}"`}
        inputValue=""
        onInputChange={() => {}}
        onSubmit={() => {}}
        submitButtonText=""
      >
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h4 className="mb-3 font-semibold text-gray-900">Edit Tag Name:</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={editingTagName}
                onChange={(e) => setEditingTagName(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tag name"
                disabled={isUpdatingTag}
              />
              <Button
                buttonText={isUpdatingTag ? "Saving..." : "Save"}
                onClick={handleUpdateTagName}
                disabled={
                  isUpdatingTag ||
                  !editingTagName.trim() ||
                  editingTagName.trim() === selectedTagForLinking?.name
                }
                className="bg-blue-600 px-4 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300"
              />
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900">
              Link Suggested Tasks:
            </h4>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg bg-gray-50 p-3">
              {suggestedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-md p-3 transition-all ${
                    isTaskLinked(task.id)
                      ? "bg-green-50 shadow-sm"
                      : "bg-white shadow-sm hover:shadow-md"
                  }`}
                >
                  <SuggestedTaskItem name={task.name} />
                  <Button
                    buttonText={isTaskLinked(task.id) ? "✓ Linked" : "Link"}
                    onClick={() => handleLinkTaskToTag(task.id)}
                    disabled={isTaskLinked(task.id) || isLinkingTask}
                    className={`px-3 py-1 text-sm font-medium ${
                      isTaskLinked(task.id)
                        ? "cursor-not-allowed bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  />
                </div>
              ))}
            </div>

            {suggestedTasks.length === 0 && (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-500">
                  No suggested tasks available. Create some tasks first.
                </p>
              </div>
            )}

            <div className="flex flex-row justify-center mt-6">
              <Button
                buttonText={isDeletingTag ? "Deleting..." : "Delete"}
                onClick={() => {
                  handleDeleteTag(selectedTagForLinking?.id);
                }}
                className="bg-red-600 align-self-end text-white shadow-sm hover:bg-red-700 active:bg-red-800"
                disabled={isDeletingTag}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminDashboard;

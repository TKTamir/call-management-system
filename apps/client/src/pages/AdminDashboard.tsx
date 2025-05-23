import React, { useState } from "react";
import { toast } from "react-toastify";
import Container from "../components/Container/Container";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import List from "../components/List/List";
import Modal from "../components/Modal/Modal";
import SuggestedTaskItem from "../components/SuggestedTask/SuggestedTaskItem";
import {
  useGetAllTagsQuery,
  useGetSuggestedTasksQuery,
  useCreateTagMutation,
  useCreateSuggestedTaskMutation,
  useAddSuggestedTaskToTagMutation,
  useGetTagSuggestedTasksQuery,
  useUpdateTagMutation,
} from "../store/api";
import { useErrorHandler } from "../hooks/useErrorHandler";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

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
  const [
    createSuggestedTask,
    { isLoading: isCreatingTask, error: createTaskError },
  ] = useCreateSuggestedTaskMutation();
  const [addSuggestedTaskToTag, { isLoading: isLinkingTask }] =
    useAddSuggestedTaskToTagMutation();

  const [updateTag, { isLoading: isUpdatingTag, error: updateTagError }] =
    useUpdateTagMutation();

  // Error handling
  useErrorHandler(tagsError);
  useErrorHandler(tasksError);
  useErrorHandler(createTagError);
  useErrorHandler(createTaskError);
  useErrorHandler(updateTagError);

  // Local state for UI
  const [activeView, setActiveView] = useState<"tags" | "suggestedTasks">(
    "tags",
  );
  const [newTagName, setNewTagName] = useState("");
  const [newSuggestedTaskName, setNewSuggestedTaskName] = useState("");
  const [editingTagName, setEditingTagName] = useState("");

  // Modal state for linking suggested tasks to tags
  const [showLinkTasksModal, setShowLinkTasksModal] = useState(false);
  const [selectedTagForLinking, setSelectedTagForLinking] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
        setNewTagName("");
      } catch (error) {
        console.error("Failed to create tag:", error);
      }
    }
  };

  const handleAddSuggestedTask = async () => {
    if (newSuggestedTaskName.trim()) {
      try {
        await createSuggestedTask({
          name: newSuggestedTaskName.trim(),
        }).unwrap();
        setNewSuggestedTaskName("");
      } catch (error) {
        console.error("Failed to create suggested task:", error);
      }
    }
  };

  // Handle tag click to open link tasks modal
  const handleTagClick = (tag: { id: number; name: string }) => {
    setSelectedTagForLinking(tag);
    setEditingTagName(tag.name);
    setShowLinkTasksModal(true);
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

  // Link suggested task to tag
  const handleLinkTaskToTag = async (taskId: number) => {
    if (!selectedTagForLinking) return;

    try {
      await addSuggestedTaskToTag({
        tagId: selectedTagForLinking.id,
        taskId,
      }).unwrap();
    } catch (error) {
      console.error("Failed to link task to tag:", error);
    }
  };

  const handleCloseModal = () => {
    setShowLinkTasksModal(false);
    setSelectedTagForLinking(null);
    setEditingTagName(""); // ADD this line
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
        <div className="flex justify-end items-center gap-4">
          <Button
            buttonText="Tags"
            onClick={handleTagsClick}
            className={`px-4 ${activeView === "tags" ? "bg-gray-100" : ""}`}
          />
          <Button
            buttonText="Tasks"
            onClick={handleSuggestedTasksClick}
            className={`px-4 ${activeView === "suggestedTasks" ? "bg-gray-100" : ""}`}
          />
        </div>

        <h2 className="text-xl font-medium mb-4">
          {activeView === "tags" ? "Tags" : "Suggested Tasks"}
        </h2>

        <div className="flex mb-6">
          <Input
            value={activeView === "tags" ? newTagName : newSuggestedTaskName}
            onChange={(e) =>
              activeView === "tags"
                ? setNewTagName(e.target.value)
                : setNewSuggestedTaskName(e.target.value)
            }
            placeholder={activeView === "tags" ? "Tag name" : "Task name"}
            className="mr-2 flex-grow min-w-0"
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
            className="px-4"
          />
        </div>

        <List
          variant={activeView}
          tags={tags}
          suggestedTasks={suggestedTasks}
          highlightIcon={true}
          onTagClick={handleTagClick}
        />
      </Container>

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
          <div className="border-b pb-4">
            <h4 className="font-medium mb-3">Edit Tag Name:</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={editingTagName}
                onChange={(e) => setEditingTagName(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
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
                className="px-4 bg-blue-50 hover:bg-blue-100"
              />
            </div>
          </div>

          <h4 className="font-medium mb-3">Link Suggested Tasks:</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {suggestedTasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-md p-3 flex justify-between items-center ${
                  isTaskLinked(task.id) ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <SuggestedTaskItem name={task.name} />
                <Button
                  buttonText={isTaskLinked(task.id) ? "✓ Linked" : "Link"}
                  onClick={() => handleLinkTaskToTag(task.id)}
                  disabled={isTaskLinked(task.id) || isLinkingTask}
                  className={`px-3 py-1 text-sm ${
                    isTaskLinked(task.id)
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : "hover:bg-blue-50"
                  }`}
                />
              </div>
            ))}
          </div>

          {suggestedTasks.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No suggested tasks available. Create some tasks first.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AdminDashboard;

import React, { useState } from "react";
import Container from "../components/Container/Container";
import List from "../components/List/List";
import SuggestedTaskItem from "../components/SuggestedTask/SuggestedTaskItem";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Button from "../components/Button/Button";
import ViewToggle from "../components/ViewToggle/ViewToggle";
import CreateItemForm from "../components/CreateItemForm/CreateItemForm";
import ItemManagementModal from "../components/ItemManagementModal/ItemManagementModal";
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
import { useCrudOperations } from "../hooks/useCrudOperations";
import { useModalState } from "../hooks/useModalState";
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

  // Custom hooks
  const { executeOperation } = useCrudOperations();
  const { openModal, closeModal, isModalOpen } = useModalState();

  // Error handling
  useErrorHandler(tagsError);
  useErrorHandler(tasksError);
  useErrorHandler(createTagError);
  useErrorHandler(deleteTagError);
  useErrorHandler(deleteTaskError);
  useErrorHandler(createTaskError);
  useErrorHandler(updateTagError);
  useErrorHandler(updateTaskError);

  // Local state
  const [activeView, setActiveView] = useState<"tags" | "suggestedTasks">(
    "tags",
  );
  const [newTagName, setNewTagName] = useState<string>("");
  const [newSuggestedTaskName, setNewSuggestedTaskName] = useState<string>("");
  const [editingTagName, setEditingTagName] = useState<string>("");
  const [editingTaskName, setEditingTaskName] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTagForLinking, setSelectedTagForLinking] =
    useState<Tag | null>(null);

  // Get tasks already linked to selected tag
  const { data: linkedTasks = [] } = useGetTagSuggestedTasksQuery(
    selectedTagForLinking?.id || 0,
    { skip: !selectedTagForLinking },
  );

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    executeOperation(() => createTag({ name: newTagName.trim() }).unwrap(), {
      successMessage: "Tag created successfully!",
      onSuccess: () => setNewTagName(""),
    });
  };

  const handleDeleteTag = (tagId?: Tag["id"]) => {
    if (!tagId) return;
    executeOperation(() => deleteTag(tagId).unwrap(), {
      successMessage: "Tag deleted successfully!",
      onSuccess: () => {
        setSelectedTagForLinking(null);
        closeModal("linkTasks");
      },
    });
  };

  const handleDeleteTask = (taskId?: Task["id"]) => {
    if (!taskId) return;
    executeOperation(() => deleteTask(taskId).unwrap(), {
      successMessage: "Task deleted successfully!",
      onSuccess: () => {
        setSelectedTask(null);
        closeModal("tasks");
      },
    });
  };

  const handleAddSuggestedTask = () => {
    if (!newSuggestedTaskName.trim()) return;
    executeOperation(
      () => createSuggestedTask({ name: newSuggestedTaskName.trim() }).unwrap(),
      {
        successMessage: "Task created successfully!",
        onSuccess: () => setNewSuggestedTaskName(""),
      },
    );
  };

  const handleTagClick = (tag: Tag) => {
    setSelectedTagForLinking(tag);
    setEditingTagName(tag.name);
    openModal("linkTasks");
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditingTaskName(task.name);
    openModal("tasks");
  };

  const handleUpdateTagName = () => {
    if (
      !selectedTagForLinking ||
      !editingTagName.trim() ||
      editingTagName.trim() === selectedTagForLinking.name
    )
      return;

    executeOperation(
      () =>
        updateTag({
          id: selectedTagForLinking.id,
          data: { name: editingTagName.trim() },
        }).unwrap(),
      {
        successMessage: `Tag renamed to "${editingTagName.trim()}" successfully!`,
        onSuccess: () =>
          setSelectedTagForLinking({
            ...selectedTagForLinking,
            name: editingTagName.trim(),
          }),
      },
    );
  };

  const handleUpdateTaskName = () => {
    if (
      !selectedTask ||
      !editingTaskName.trim() ||
      editingTaskName.trim() === selectedTask.name
    )
      return;

    executeOperation(
      () =>
        updateTask({
          id: selectedTask.id,
          data: { name: editingTaskName.trim() },
        }).unwrap(),
      {
        successMessage: `Task renamed to "${editingTaskName.trim()}" successfully!`,
      },
    );
  };

  const handleLinkTaskToTag = (taskId: number) => {
    if (!selectedTagForLinking) return;
    executeOperation(
      () =>
        addSuggestedTaskToTag({
          tagId: selectedTagForLinking.id,
          taskId,
        }).unwrap(),
      { successMessage: "Task linked to tag successfully!" },
    );
  };

  const handleCloseModal = () => {
    closeModal("linkTasks");
    closeModal("tasks");
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

  const views = [
    { key: "tags", label: "Tags" },
    { key: "suggestedTasks", label: "Tasks" },
  ];

  return (
    <>
      <Container>
        <ViewToggle
          activeView={activeView}
          views={views}
          onViewChange={setActiveView}
        />

        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          {activeView === "tags" ? "Tags" : "Suggested Tasks"}
        </h2>

        <CreateItemForm
          value={activeView === "tags" ? newTagName : newSuggestedTaskName}
          onChange={
            activeView === "tags" ? setNewTagName : setNewSuggestedTaskName
          }
          onSubmit={
            activeView === "tags" ? handleAddTag : handleAddSuggestedTask
          }
          placeholder={activeView === "tags" ? "Tag name" : "Task name"}
          buttonText={activeView === "tags" ? "Add Tag" : "Add Task"}
          isLoading={activeView === "tags" ? isCreatingTag : isCreatingTask}
        />

        <List
          variant={activeView}
          tags={tags}
          suggestedTasks={suggestedTasks}
          highlightIcon={true}
          onTagClick={handleTagClick}
          onTaskClick={handleTaskClick}
        />
      </Container>

      <ItemManagementModal
        isOpen={isModalOpen("tasks")}
        onClose={handleCloseModal}
        title={`Manage Task: "${selectedTask?.name}"`}
        itemName={selectedTask?.name || ""}
        editingName={editingTaskName}
        onEditingNameChange={setEditingTaskName}
        onUpdate={handleUpdateTaskName}
        onDelete={() => handleDeleteTask(selectedTask?.id)}
        isUpdating={isUpdatingTask}
        isDeleting={isDeletingTask}
      />

      <ItemManagementModal
        isOpen={isModalOpen("linkTasks")}
        onClose={handleCloseModal}
        title={`Manage Tag: "${selectedTagForLinking?.name}"`}
        itemName={selectedTagForLinking?.name || ""}
        editingName={editingTagName}
        onEditingNameChange={setEditingTagName}
        onUpdate={handleUpdateTagName}
        onDelete={() => handleDeleteTag(selectedTagForLinking?.id)}
        isUpdating={isUpdatingTag}
        isDeleting={isDeletingTag}
      >
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
        </div>
      </ItemManagementModal>
    </>
  );
};

export default AdminDashboard;

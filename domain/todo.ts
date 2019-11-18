export type Task = TaskID & TaskDraft;

export const toDraft = (task: Task): TaskDraft => {
  const { id, ...draft } = task;
  return draft;
};

export type TaskID = ID;
export interface ID {
  id: string;
}

export interface TaskDraft {
  title: string;
  description: string;
  isActive: boolean;
  projectId: string;
}

export type ProjectID = ID;
export type Project = ProjectID & ProjectDraft;
export interface ProjectDraft {
  title: string;
  description: string;
}

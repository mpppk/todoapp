export type ITask = TaskID & ITaskDraft;

export const toDraft = (task: ITask): ITaskDraft => {
  const { id, ...draft } = task;
  return draft;
};

export type TaskID = IID;
export interface IID {
  id: string;
}

export interface ITaskDraft {
  title: string;
  description: string;
  isActive: boolean;
}

export type ProjectID = IID;
export type IProject = ProjectID & IProjectDraft;
export interface IProjectDraft {
  title: string;
  description: string;
}

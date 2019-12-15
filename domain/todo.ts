import { User } from './user';

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
export type ProjectRole = 'projectOwner' | 'projectWriter' | 'projectReader';

export const toRoleDisplayName = (role: ProjectRole) => {
  switch (role) {
    case 'projectReader':
      return 'Reader';
    case 'projectWriter':
      return 'Writer';
    case 'projectOwner':
      return 'Owner';
    default:
      const _: never = role;
      return _;
  }
};

export interface ProjectMember {
  user: User;
  role: ProjectRole;
}

export interface ProjectMemberRoles {
  [userId: string]: ProjectRole;
}

export interface ProjectDraft {
  title: string;
  description: string;
  memberRoles: ProjectMemberRoles;
}

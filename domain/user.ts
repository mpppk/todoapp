import { ProjectRole } from './todo';

export interface JoinedProjects {
  [projectId: string]: ProjectRole;
}
export interface User {
  displayName?: string;
  projects: JoinedProjects;
  photoURL?: string;
  id: string;
}

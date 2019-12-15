import { ProjectRole } from './todo';

export interface JoinedProjects {
  [projectId: string]: ProjectRole;
}
export interface User {
  displayName?: string;
  email?: string;
  emailVerified: boolean;
  projects: JoinedProjects;
  photoURL?: string;
  isAnonymous: boolean;
  phoneNumber: string | null;
  id: string;
}

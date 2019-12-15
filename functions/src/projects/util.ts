import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import { ProjectMemberRoles, Project, ProjectRole } from '../../../domain/todo';
import UpdateData = firebase.firestore.UpdateData;

export interface UserUpdate {
  id: string;
  data: UpdateData;
}

export interface MembersDiff {
  addedMembers: ProjectMemberRoles;
  removedMemberIDs: string[];
  updatedMembers: ProjectMemberRoles;
}

export const calcDiffMembers = (
  beforeMembers: ProjectMemberRoles,
  afterMembers: ProjectMemberRoles
): MembersDiff => {
  const afterMemberIDs = Object.keys(afterMembers);
  const addedMembers = Object.entries(afterMembers)
    .filter(([userId]) => !beforeMembers[userId])
    .reduce((acc, [userId, afterRole]) => {
      acc[userId] = afterRole;
      return acc;
    }, {} as ProjectMemberRoles);

  const removedMemberIDs = Object.keys(beforeMembers).filter(
    id => !afterMemberIDs.includes(id)
  );

  const updatedMembers = Object.entries(afterMembers)
    .filter(([userId, afterRole]) => {
      const beforeRole = beforeMembers[userId];
      if (!beforeRole) {
        return false;
      }
      return beforeRole !== afterRole;
    })
    .reduce((acc, [userId, afterRole]) => {
      acc[userId] = afterRole;
      return acc;
    }, {} as ProjectMemberRoles);

  return { addedMembers, removedMemberIDs, updatedMembers };
};

const membersToUserUpdates = (
  members: { [id: string]: ProjectRole },
  projectId: string
) => Object.entries(members).map(generateEntryToUserUpdateFunc(projectId));

const generateEntryToUserUpdateFunc = (projectId: string) => {
  return ([userId, role]: [string, ProjectRole]) => ({
    id: userId,
    data: { ['projects.' + projectId]: role }
  });
};

const generateUserUpdateForDeleteProjectFunc = (projectId: string) => {
  return ([userId, _]: [string, ProjectRole]) => ({
    id: userId,
    data: { ['projects.' + projectId]: admin.firestore.FieldValue.delete() }
  });
};

export const getUserUpdateDataFromNewProject = (project: Project) => {
  return membersToUserUpdates(project.memberRoles, project.id);
};

export const getUserUpdateDataFromProjectDiffMembers = (
  projectId: string,
  diffMembers: MembersDiff
) => {
  const addedUserUpdates = membersToUserUpdates(
    diffMembers.addedMembers,
    projectId
  );
  const userUpdates = membersToUserUpdates(
    diffMembers.updatedMembers,
    projectId
  );
  const removeUserUpdate = diffMembers.removedMemberIDs.map(id => {
    return {
      id,
      data: { ['projects.' + projectId]: admin.firestore.FieldValue.delete() }
    };
  });
  return [...addedUserUpdates, ...userUpdates, ...removeUserUpdate];
};

export const getUserUpdateDataFromDeletedProject = (project: Project) => {
  return Object.entries(project.memberRoles).map(
    generateUserUpdateForDeleteProjectFunc(project.id)
  );
};

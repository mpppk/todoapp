import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import { ProjectMembers, Project, ProjectRoles } from '../../../domain/todo';
import UpdateData = firebase.firestore.UpdateData;

export interface UserUpdate {
  id: string;
  data: UpdateData;
}

export interface MembersDiff {
  addedMembers: ProjectMembers;
  removedMemberIDs: string[];
  updatedMembers: ProjectMembers;
}

export const calcDiffMembers = (
  beforeMembers: ProjectMembers,
  afterMembers: ProjectMembers
): MembersDiff => {
  const afterMemberIDs = Object.keys(afterMembers);
  const addedMembers = Object.entries(afterMembers)
    .filter(([userId]) => !beforeMembers[userId])
    .reduce((acc, [userId, afterRole]) => {
      acc[userId] = afterRole;
      return acc;
    }, {} as ProjectMembers);

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
    }, {} as ProjectMembers);

  return { addedMembers, removedMemberIDs, updatedMembers };
};

const membersToUserUpdates = (
  members: { [id: string]: ProjectRoles },
  projectId: string
) => Object.entries(members).map(generateEntryToUserUpdateFunc(projectId));

const generateEntryToUserUpdateFunc = (projectId: string) => {
  return ([userId, role]: [string, ProjectRoles]) => ({
    id: userId,
    data: { ['projects.' + projectId]: role }
  });
};

const generateUserUpdateForDeleteProjectFunc = (projectId: string) => {
  return ([userId, _]: [string, ProjectRoles]) => ({
    id: userId,
    data: { ['projects.' + projectId]: admin.firestore.FieldValue.delete() }
  });
};

export const getUserUpdateDataFromNewProject = (project: Project) => {
  return membersToUserUpdates(project.members, project.id);
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
  return Object.entries(project.members).map(
    generateUserUpdateForDeleteProjectFunc(project.id)
  );
};

import * as functions from 'firebase-functions';
import { Project } from '../../../domain/todo';
import { updateUsersAsBatch } from '../users';
import { isValidChange, isValidSnapShot } from '../util';
import {
  getUserUpdateDataFromNewProject,
  calcDiffMembers,
  getUserUpdateDataFromDeletedProject,
  getUserUpdateDataFromProjectDiffMembers
} from './util';

const projectDoc = functions.firestore.document('projects/{projectId}');

export const createProject = projectDoc.onCreate(async (snap, context) => {
  if (!isValidSnapShot(snap)) {
    return;
  }
  const newProject = snap.data() as Project;
  const projectId = context.params.projectId;
  const userUpdates = getUserUpdateDataFromNewProject({
    ...newProject,
    id: projectId
  });
  await updateUsersAsBatch(userUpdates);
});

export const updateProject = projectDoc.onUpdate(async (change, context) => {
  if (!isValidChange(change)) {
    return;
  }
  const beforeMembers = (change.before.data() as Project).memberRoles;
  const afterMembers = (change.after.data() as Project).memberRoles;
  const projectId = context.params.projectId;

  const diffMembers = calcDiffMembers(beforeMembers, afterMembers);
  const userUpdates = getUserUpdateDataFromProjectDiffMembers(
    projectId,
    diffMembers
  );
  await updateUsersAsBatch(userUpdates);
});

export const deleteProject = projectDoc.onDelete(async (snap, _context) => {
  if (!isValidSnapShot(snap)) {
    return;
  }
  const deletedProject = snap.data() as Project;

  const userUpdates = getUserUpdateDataFromDeletedProject(deletedProject);
  await updateUsersAsBatch(userUpdates);
});

import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Project, ProjectRoles } from '../../domain/todo';
import DocumentSnapshot = admin.firestore.DocumentSnapshot;
import UpdateData = firebase.firestore.UpdateData;

admin.initializeApp();
const db = admin.firestore();

const projectDoc = functions.firestore.document('projects/{projectId}');
const userCollection = db.collection('users');

const isValidSnapShot = (snap: DocumentSnapshot): boolean => {
  if (snap.data() === undefined) {
    console.warn('snapshot is undefined');
    return false;
  }
  return true;
};

const isValidChange = (change: functions.Change<DocumentSnapshot>): boolean => {
  if (change.before.data() === undefined) {
    console.warn('before doc is undefined');
    return false;
  }
  if (change.after.data() === undefined) {
    console.warn('after doc is undefined');
    return false;
  }
  return true;
};

interface UserUpdate {
  id: string;
  data: UpdateData;
}

const updateUsersAsBatch = async (userUpdates: UserUpdate[]) => {
  const batch = db.batch();
  userUpdates.forEach(u => batch.update(userCollection.doc(u.id), u.data));
  await batch.commit();
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

export const createProject = projectDoc.onCreate(async (snap, context) => {
  if (!isValidSnapShot(snap)) {
    return;
  }
  const newProject = snap.data() as Project;
  const projectId = context.params.projectId;
  await updateUsersAsBatch(membersToUserUpdates(newProject.members, projectId));
});

export const updateProject = projectDoc.onUpdate(async (change, context) => {
  if (!isValidChange(change)) {
    return;
  }
  const beforeMembers = (change.before.data() as Project).members;
  const afterMembers = (change.after.data() as Project).members;
  const projectId = context.params.projectId;

  const userUpdates = Object.entries(afterMembers)
    .filter(([userId, afterRole]) => {
      const beforeRole = beforeMembers[userId];
      return !beforeRole || beforeRole !== afterRole;
    })
    .map(generateEntryToUserUpdateFunc(projectId));
  await updateUsersAsBatch(userUpdates);
});

export const deleteProject = projectDoc.onDelete(async (snap, context) => {
  if (!isValidSnapShot(snap)) {
    return;
  }
  const deletedProject = snap.data() as Project;
  const projectId = context.params.projectId;
  const userUpdates = Object.entries(
    deletedProject.members
  ).map(([userId, role]) => ({
    id: userId,
    data: { ['projects.' + projectId]: admin.firestore.FieldValue.delete() }
  }));
  await updateUsersAsBatch(userUpdates);
});

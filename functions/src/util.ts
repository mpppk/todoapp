import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import DocumentSnapshot = admin.firestore.DocumentSnapshot;

export const isValidSnapShot = (snap: DocumentSnapshot): boolean => {
  if (snap.data() === undefined) {
    console.warn('snapshot is undefined');
    return false;
  }
  return true;
};

export const isValidChange = (
  change: functions.Change<DocumentSnapshot>
): boolean => {
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

admin.initializeApp();
export const db = admin.firestore();

import { UserUpdate } from './projects/util';
import { db } from './util';

const userCollection = db.collection('users');

export const updateUsersAsBatch = async (userUpdates: UserUpdate[]) => {
  const batch = db.batch();
  userUpdates.forEach(u => batch.update(userCollection.doc(u.id), u.data));
  await batch.commit();
};

import * as firebase from '@firebase/testing';
import { initDBWithUID } from './projects';

describe('/users', () => {
  const uid = 'alice';
  const db = initDBWithUID(uid);
  const userCollection = db.collection('users');

  it('can list all users', async () => {
    await firebase.assertSucceeds(userCollection.get());
    await firebase.assertSucceeds(userCollection.doc(uid).get());
  });
  it('can write only own profiler', async () => {
    await firebase.assertSucceeds(
      userCollection.doc(uid).set({ name: 'alice' })
    );
    await firebase.assertFails(
      userCollection.doc('noexistuser').set({ name: 'xxx' })
    );
  });
});

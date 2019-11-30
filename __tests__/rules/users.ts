import * as firebase from '@firebase/testing';
import * as fs from 'fs';

describe('/users', () => {
  const opt = {
    auth: {
      email: 'alice@example.com',
      uid: 'alice'
    },
    projectId: 'user-test-project',
    rules: fs.readFileSync('firestore.rules', 'utf8')
  };
  const db = firebase.initializeTestApp(opt).firestore();
  const userCollection = db.collection('users');

  beforeAll(async () => {
    await firebase.loadFirestoreRules(opt);
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData(opt);
  });

  it('can list all users', async () => {
    await firebase.assertSucceeds(userCollection.get());
    await firebase.assertSucceeds(userCollection.doc(opt.auth.uid).get());
  });
  it('can update own profile', async () => {
    await firebase.assertSucceeds(
      userCollection.doc(opt.auth.uid).set({ name: 'alice' })
    );
  });

  it('can not write not own profile', async () => {
    await firebase.assertFails(
      userCollection.doc('noexistuser').set({ name: 'xxx' })
    );
  });
});

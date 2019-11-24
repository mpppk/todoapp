import * as firebase from '@firebase/testing';

export const initDBWithUID = (uid: string) => {
  return firebase
    .initializeTestApp({
      auth: { uid, email: 'alice@example.com' },
      projectId: 'my-test-project'
    })
    .firestore();
};

describe('/projects', () => {
  const uid = 'alice';
  const db = initDBWithUID(uid);
  const projectCollection = db.collection('projects');
  it('can not list all projects', async () => {
    await firebase.assertFails(projectCollection.doc().set({ a: 1 }));
    await firebase.assertFails(projectCollection.get());
  });

  it('can list own projects', async () => {
    await firebase.assertSucceeds(
      projectCollection.where('ownerId', '==', uid).get()
    );
  });
});

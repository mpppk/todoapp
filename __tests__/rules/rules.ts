import * as firebase from '@firebase/testing';

describe('/projects', () => {
  it('can not list all projects', async () => {
    const uid = 'alice';
    const db = firebase
      .initializeTestApp({
        auth: { uid, email: 'alice@example.com' },
        projectId: 'my-test-project'
      })
      .firestore();
    const projectCollection = db.collection('projects');
    await firebase.assertFails(projectCollection.doc().set({ a: 1 }));
    await firebase.assertFails(projectCollection.get());
    await firebase.assertSucceeds(
      projectCollection.where('ownerId', '==', uid).get()
    );
  });
});

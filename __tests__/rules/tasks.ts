import * as firebase from '@firebase/testing';
import * as fs from 'fs';

describe('/projects/$(projectID)/tasks', () => {
  const opt = {
    auth: {
      email: 'alice@example.com',
      uid: 'alice'
    },
    projectId: 'test-task-id',
    rules: fs.readFileSync('firestore.rules', 'utf8')
  };
  const db = firebase.initializeTestApp(opt).firestore();
  const adminDB = firebase.initializeAdminApp(opt).firestore();
  const task0Collection = db.collection('projects/0/tasks');
  const task1Collection = db.collection('projects/1/tasks');
  const task2Collection = db.collection('projects/2/tasks');

  const setProject = async () => {
    const projects = [
      {
        members: {
          alice: 'projectOwner'
        },
        title: 'projectA'
      },
      {
        members: {
          alice: 'projectReader',
          bob: 'projectOwner'
        },
        title: 'projectB'
      },
      {
        members: {
          bob: 'projectOwner'
        },
        title: 'projectC'
      }
    ];
    const pCollection = adminDB.collection('projects');
    const batch = adminDB.batch();
    projects.forEach((p, i) => batch.set(pCollection.doc(i.toString()), p));
    await batch.commit();
  };

  beforeAll(async () => {
    await firebase.loadFirestoreRules(opt);
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData(opt);
    await setProject();
  });

  it('can create new task if user is owner or writer', async () => {
    await firebase.assertSucceeds(task0Collection.add({ a: 1 }));
  });

  it('can not create new task if user is reader', async () => {
    await firebase.assertFails(task1Collection.add({ a: 1 }));
  });

  it('can list all tasks if user is member', async () => {
    await firebase.assertSucceeds(task0Collection.get());
    await firebase.assertSucceeds(task1Collection.get());
  });

  it('can not list all tasks if user is not member', async () => {
    await firebase.assertFails(task2Collection.get());
  });

  it('can delete task by projectWriter', async () => {
    await firebase.assertSucceeds(task0Collection.doc('xxx').delete());
  });

  it('can not delete task by projectReader', async () => {
    await firebase.assertFails(task1Collection.doc('xxx').delete());
  });

  it('can not delete project by non member', async () => {
    await firebase.assertFails(task2Collection.doc('xxx').delete());
  });
});

import * as firebase from '@firebase/testing';
import * as fs from 'fs';
import QuerySnapshot = firebase.firestore.QuerySnapshot;

describe('/projects', () => {
  const opt = {
    auth: {
      email: 'alice@example.com',
      uid: 'alice'
    },
    projectId: 'test-project-id',
    rules: fs.readFileSync('firestore.rules', 'utf8')
  };
  const db = firebase.initializeTestApp(opt).firestore();
  const adminDB = firebase.initializeAdminApp(opt).firestore();
  const projectCollection = db.collection('projects');

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
    projects.forEach(p => batch.set(pCollection.doc(), p));
    await batch.commit();
  };

  beforeAll(async () => {
    await firebase.loadFirestoreRules(opt);
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData(opt);
    await setProject();
  });

  it('can create new project', async () => {
    await firebase.assertSucceeds(projectCollection.add({ a: 1 }));
  });

  it('can not list all projects', async () => {
    await firebase.assertFails(projectCollection.get());
  });

  it('can list own projects', async () => {
    const allowedProjectRoles = [
      'projectOwner',
      'projectWriter',
      'projectReader'
    ];
    const query = projectCollection
      .where(`members.${opt.auth.uid}`, 'in', allowedProjectRoles)
      .orderBy('title');
    const projects: QuerySnapshot = await firebase.assertSucceeds(query.get());
    expect(projects.size).toBe(2);
    const project1 = projects.docs[0].data();
    expect(project1.title).toBe('projectA');
    const project2 = projects.docs[1].data();
    expect(project2.title).toBe('projectB');
  });

  it('can delete project by projectOwner', async () => {
    const allowedProjectRoles = ['projectOwner'];
    const query = projectCollection.where(
      `members.${opt.auth.uid}`,
      'in',
      allowedProjectRoles
    );
    const projects = await query.get();
    expect(projects.size).toBeGreaterThanOrEqual(1);

    for (const doc of projects.docs) {
      await firebase.assertSucceeds(projectCollection.doc(doc.id).delete());
    }
  });

  it('can not delete project by projectWriter or projectReader', async () => {
    const allowedProjectRoles = ['projectWriter', 'projectReader'];
    const query = projectCollection.where(
      `members.${opt.auth.uid}`,
      'in',
      allowedProjectRoles
    );
    const projects = await query.get();
    expect(projects.size).toBeGreaterThanOrEqual(1);

    for (const doc of projects.docs) {
      await firebase.assertFails(projectCollection.doc(doc.id).delete());
    }
  });
});

import { Project } from '../../domain/todo';
import {
  parseCollectionPath,
  removeDocuments,
  replaceDocument,
  updateDocuments
} from '../../services/firestore';

describe('parseCollectionPath', () => {
  it('can parse', async () => {
    const result = parseCollectionPath('/projects/{projectId}/tasks', {
      projectId: 1
    });
    expect(result).toBe('/projects/1/tasks');
  });
});

describe('updateDocuments', () => {
  it('append projects to exist projects', async () => {
    const projects: Project[] = [
      {
        description: 'test1',
        id: 'project1',
        members: {},
        title: 'test1'
      },
      {
        description: 'test2',
        id: 'project2',
        members: {},
        title: 'test2'
      }
    ];

    const newProjects = [
      {
        description: 'test3',
        id: 'project3',
        members: {},
        title: 'test3'
      }
    ];

    const updatedProjects = updateDocuments(projects, newProjects);
    expect(updatedProjects).toHaveLength(3);
    expect(updatedProjects[0].id).toBe('project1');
    expect(updatedProjects[1].id).toBe('project2');
    expect(updatedProjects[2].id).toBe('project3');
  });

  it('update exist project', async () => {
    const projects: Project[] = [
      {
        description: 'test1',
        id: 'project1',
        members: {},
        title: 'test1'
      }
    ];

    const updatedTitle = 'updated-title';
    const newProjects = [
      {
        description: 'test2',
        id: 'project1',
        members: {},
        title: updatedTitle
      }
    ];

    const updatedProjects = updateDocuments(projects, newProjects);
    expect(updatedProjects).toHaveLength(1);
    expect(updatedProjects[0]).toEqual(newProjects[0]);
  });
});

describe('replaceDocument', () => {
  const doc1 = { id: 'id1', title: 'a' };
  const doc2 = { id: 'id2', title: 'b' };
  const documents = [doc1, doc2];

  it('replace first document by id', async () => {
    const newDoc = { id: 'id1', title: 'newDocument' };
    const updatedDocuments = replaceDocument(documents, newDoc);
    expect(updatedDocuments).toHaveLength(2);
    expect(updatedDocuments[0]).toBe(newDoc);
    expect(updatedDocuments[1]).toBe(doc2);
  });
  it('replace last document by id', async () => {
    const newDoc = { id: 'id2', title: 'newDocument' };
    const updatedDocuments = replaceDocument(documents, newDoc);
    expect(updatedDocuments).toHaveLength(2);
    expect(updatedDocuments[0]).toBe(doc1);
    expect(updatedDocuments[1]).toBe(newDoc);
  });
});

describe('removeDocuments', () => {
  const doc1 = { id: 'id1', title: 'a' };
  const doc2 = { id: 'id2', title: 'b' };
  const documents = [doc1, doc2];

  it('remove first document by id', async () => {
    const remDocs = [{ id: 'id1', title: 'remDocument' }];
    const newDocuments = removeDocuments(documents, remDocs);
    expect(newDocuments).toHaveLength(1);
    expect(newDocuments[0]).toBe(doc2);
  });

  it('remove last document by id', async () => {
    const remDocs = [{ id: 'id2', title: 'remDocument' }];
    const newDocuments = removeDocuments(documents, remDocs);
    expect(newDocuments).toHaveLength(1);
    expect(newDocuments[0]).toBe(doc1);
  });
});

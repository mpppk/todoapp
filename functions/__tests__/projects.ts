import * as admin from 'firebase-admin';
import { ProjectMemberRoles } from '../../domain/todo';
import {
  calcDiffMembers,
  getUserUpdateDataFromDeletedProject,
  getUserUpdateDataFromNewProject,
  getUserUpdateDataFromProjectDiffMembers,
  MembersDiff
} from '../src/projects/util';

describe('callDiffMembers', () => {
  it('return empty diff if memberRoles are not changed', async () => {
    const beforeMembers: ProjectMemberRoles = {
      alice: 'projectReader'
    };
    const afterMembers: ProjectMemberRoles = {
      alice: 'projectReader'
    };

    const diff = calcDiffMembers(beforeMembers, afterMembers);
    const expectedDiff: MembersDiff = {
      addedMembers: {},
      removedMemberIDs: [],
      updatedMembers: {}
    };
    expect(diff).toStrictEqual(expectedDiff);
  });

  it('return diff if member is changed', async () => {
    const beforeMembers: ProjectMemberRoles = {
      alice: 'projectReader',
      bob: 'projectReader'
    };
    const afterMembers: ProjectMemberRoles = {
      alice: 'projectOwner',
      carol: 'projectReader'
    };

    const diff = calcDiffMembers(beforeMembers, afterMembers);
    const expectedDiff: MembersDiff = {
      addedMembers: { carol: 'projectReader' },
      removedMemberIDs: ['bob'],
      updatedMembers: { alice: 'projectOwner' }
    };
    expect(diff).toStrictEqual(expectedDiff);
  });
});

describe('getUserUpdateDataFromNewProject', () => {
  it('return valid member updates', async () => {
    const project = {
      id: 'p1',
      memberRoles: {
        alice: 'projectReader',
        bob: 'projectOwner'
      } as ProjectMemberRoles,
      title: 'title',
      description: 'desc'
    };
    const userUpdates = getUserUpdateDataFromNewProject(project);
    expect(userUpdates).toStrictEqual(
      expect.arrayContaining([
        { id: 'alice', data: { 'projects.p1': 'projectReader' } },
        { id: 'bob', data: { 'projects.p1': 'projectOwner' } }
      ])
    );
  });
});

describe('getUserUpdateDataFromProjectDiffMembers', () => {
  it('return valid member updates', async () => {
    const diffMembers: MembersDiff = {
      addedMembers: {
        alice: 'projectOwner'
      },
      removedMemberIDs: ['bob'],
      updatedMembers: {
        carol: 'projectWriter'
      }
    };
    const userUpdates = getUserUpdateDataFromProjectDiffMembers(
      'p1',
      diffMembers
    );
    expect(userUpdates).toStrictEqual(
      expect.arrayContaining([
        { id: 'alice', data: { 'projects.p1': 'projectOwner' } },
        {
          id: 'bob',
          data: { 'projects.p1': admin.firestore.FieldValue.delete() }
        },
        { id: 'carol', data: { 'projects.p1': 'projectWriter' } }
      ])
    );
  });
});

describe('getUserUpdateDataFromDeletedProject', () => {
  it('return valid member updates', async () => {
    const project = {
      id: 'p1',
      memberRoles: {
        alice: 'projectReader',
        bob: 'projectOwner'
      } as ProjectMemberRoles,
      title: 'title',
      description: 'desc'
    };
    const userUpdates = getUserUpdateDataFromDeletedProject(project);
    expect(userUpdates).toStrictEqual(
      expect.arrayContaining([
        {
          id: 'alice',
          data: { 'projects.p1': admin.firestore.FieldValue.delete() }
        },
        {
          id: 'bob',
          data: { 'projects.p1': admin.firestore.FieldValue.delete() }
        }
      ])
    );
  });
});

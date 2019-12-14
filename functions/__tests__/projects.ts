import { ProjectMembers } from '../../domain/todo';
import { calcDiffMembers, MembersDiff } from '../src/projects/util';

describe('callDiffMembers', () => {
  it('return diff', async () => {
    const beforeMembers: ProjectMembers = {
      alice: 'projectReader'
    };
    const afterMembers: ProjectMembers = {
      alice: 'projectReader'
    };

    const diff = calcDiffMembers(beforeMembers, afterMembers);
    const expectedDiff: MembersDiff = {
      removedMemberIDs: [],
      updatedMembers: {}
    };
    expect(diff).toStrictEqual(expectedDiff);
  });
});

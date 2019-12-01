import { parseCollectionPath } from '../../services/firestore';

describe('parseCollectionPath', () => {
  it('can parse', async () => {
    const result = parseCollectionPath('/projects/{projectId}/tasks', {
      projectId: 1
    });
    expect(result).toBe('/projects/1/tasks');
  });
});

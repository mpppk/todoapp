import { Project } from '../../domain/todo';
import { updateProjects } from '../../reducers/global';

describe('updateProjects', () => {
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

    const updatedProjects = updateProjects(projects, newProjects);
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

    const updatedProjects = updateProjects(projects, newProjects);
    expect(updatedProjects).toHaveLength(1);
    expect(updatedProjects[0]).toEqual(newProjects[0]);
  });
});

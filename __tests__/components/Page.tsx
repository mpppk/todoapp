import { shallow } from 'enzyme';
import * as React from 'react';
import Page from '../../components/Page';
import { Task } from '../../components/todo/Task';
import { ITask } from '../../domain/todo';

describe('Page', () => {
  // tslint:disable-next-line no-empty
  const emptyClickEventHandler = () => {};

  const wrapper = shallow(
    <Page
      user={null}
      onClickNewTaskButton={emptyClickEventHandler}
      tasks={[]}
    />
  );
  it('has no Task', async () => {
    expect(wrapper.find(Task)).toHaveLength(0);
  });
});

describe('Page with task', () => {
  // tslint:disable-next-line no-empty
  const emptyClickEventHandler = () => {};

  const tasks: ITask[] = [
    {
      description: 'description',
      isActive: true,
      title: 'title'
    }
  ];

  const wrapper = shallow(
    <Page
      user={null}
      onClickNewTaskButton={emptyClickEventHandler}
      tasks={tasks}
    />
  );
  it('has no Task', async () => {
    expect(wrapper.find(Task)).toHaveLength(1);
  });
});

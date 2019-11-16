import { shallow } from 'enzyme';
import * as React from 'react';
import Page from '../../components/Page';
import { Task } from '../../components/todo/Task';
import { WritableTask } from '../../components/todo/WritableTask';
import { ITask } from '../../domain/todo';

describe('Page', () => {
  // tslint:disable-next-line no-empty
  const emptyClickEventHandler = () => {};

  const wrapper = shallow(
    <Page
      user={null}
      onClickNewTaskButton={emptyClickEventHandler}
      tasks={[]}
      disableNewTaskButton={true}
      onClickDeleteTaskButton={emptyClickEventHandler}
      onClickEditTaskButton={emptyClickEventHandler}
      editTaskId={'id'}
      onClickCloseTaskButton={emptyClickEventHandler}
      onClickUpdateTaskButton={emptyClickEventHandler}
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
      id: 'id',
      isActive: true,
      title: 'title'
    }
  ];

  const wrapper = shallow(
    <Page
      user={null}
      onClickNewTaskButton={emptyClickEventHandler}
      tasks={tasks}
      disableNewTaskButton={true}
      editTaskId={'noexist_id'}
      onClickDeleteTaskButton={emptyClickEventHandler}
      onClickEditTaskButton={emptyClickEventHandler}
      onClickCloseTaskButton={emptyClickEventHandler}
      onClickUpdateTaskButton={emptyClickEventHandler}
    />
  );
  it('has one Task', async () => {
    expect(wrapper.find(Task)).toHaveLength(1);
  });
  it('has no writable Task', async () => {
    expect(wrapper.find(WritableTask)).toHaveLength(0);
  });
});

describe('Page with editable task', () => {
  // tslint:disable-next-line no-empty
  const emptyClickEventHandler = () => {};

  const tasks: ITask[] = [
    {
      description: 'description',
      id: 'id',
      isActive: true,
      title: 'title'
    }
  ];

  const wrapper = shallow(
    <Page
      user={null}
      onClickNewTaskButton={emptyClickEventHandler}
      tasks={tasks}
      disableNewTaskButton={true}
      editTaskId={'id'}
      onClickDeleteTaskButton={emptyClickEventHandler}
      onClickEditTaskButton={emptyClickEventHandler}
      onClickCloseTaskButton={emptyClickEventHandler}
      onClickUpdateTaskButton={emptyClickEventHandler}
    />
  );
  it('has no Task', async () => {
    expect(wrapper.find(Task)).toHaveLength(0);
  });
  it('has one writable Task', async () => {
    expect(wrapper.find(WritableTask)).toHaveLength(1);
  });
});

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { sessionActionCreators } from '../actions/session';
import { todoActionCreators } from '../actions/todo';
import MyAppBar from '../components/AppBar';
import Page from '../components/Page';
import { ITask } from '../domain/todo';
import { IUser, State } from '../reducer';

type IndexProps = {
  user: IUser | null;
  tasks: ITask[];
} & typeof sessionActionCreators &
  typeof todoActionCreators;

class Index extends React.Component<IndexProps> {
  constructor(props: IndexProps) {
    super(props);
    this.handleClickLogout = this.handleClickLogout.bind(this);
  }

  public componentDidMount(): void {
    this.props.requestToInitializeFirebase();
  }

  public async handleClickLogout(): Promise<void> {
    this.props.requestToLogout();
  }

  // tslint:disable-next-line member-access
  render() {
    return (
      <div>
        <MyAppBar
          user={this.props.user}
          onClickLogout={this.handleClickLogout}
        />
        <Page
          user={this.props.user}
          tasks={this.props.tasks}
          onClickNewTaskButton={this.props.clickNewTaskButton}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    tasks: state.tasks,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ ...sessionActionCreators }, dispatch),
    ...bindActionCreators({ ...todoActionCreators }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);

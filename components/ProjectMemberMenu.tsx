import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as React from 'react';

interface ProjectMemberMenuProps {
  id: string;
  anchorEl: null | HTMLElement;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClose: () => void;
}

// tslint:disable-next-line variable-name
export const ProjectMemberMenu: React.FunctionComponent<ProjectMemberMenuProps> = props => {
  return (
    <Menu
      id={props.id}
      anchorEl={props.anchorEl}
      keepMounted={true}
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
    >
      <MenuItem onClick={props.onClickEdit}>Change role</MenuItem>
      <MenuItem onClick={props.onClickDelete}>Remove</MenuItem>
    </Menu>
  );
};

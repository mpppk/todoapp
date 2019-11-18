import { Theme } from '@material-ui/core';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import { makeStyles } from '@material-ui/styles';
import Link from 'next/link';
import * as React from 'react';

const useStyles = makeStyles((_theme: Theme) => ({
  list: {
    width: 250
  }
}));

// tslint:disable-next-line variable-name
export const SideList: React.FunctionComponent = () => {
  const classes = useStyles(undefined);

  return (
    <div className={classes.list}>
      <List>
        <Link href={'/'}>
          <ListItem button={true} key={'Home'}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>
        </Link>
        <Link href={'/about'}>
          <ListItem button={true} key={'About'}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={'About'} />
          </ListItem>
        </Link>
        <Link href={'/projects'}>
          <ListItem button={true} key={'Projects'}>
            <ListItemIcon>
              <ListAltOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={'Projects'} />
          </ListItem>
        </Link>
      </List>
    </div>
  );
};

import Link from 'next/link';
import {
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from  '@material-ui/core';

export default ({ pathname }: { pathname?: any }) => (
  <header>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu">
          </IconButton>
          <Typography variant="h6" color="inherit">
            News
          </Typography>
          <Link href='/about'>
            <a className={pathname === '/about' ? 'is-active' : ''}>About</a>
          </Link>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
  </header>
);

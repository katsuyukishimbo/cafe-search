import Link from 'next/link'
import { withStyles, AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core'

export default ({ pathname }: { pathname?: any }) => (
  <header>
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu" />
        <Typography variant="h6" color="inherit">
          News
        </Typography>
        <Link href="/about">
          <a className={pathname === '/about' ? 'is-active' : ''}>About</a>
        </Link>
        <Link href="/login">
          <Button color="inherit">Login</Button>
        </Link>
      </Toolbar>
    </AppBar>
  </header>
)

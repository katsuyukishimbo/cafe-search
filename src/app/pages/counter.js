import React, { useState } from 'react'

import { makeStyles } from '@material-ui/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}))

const Counter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(prevCount => prevCount + 1)
  const decrement = () => setCount(prevCount => prevCount - 1)
  const reset = () => setCount(0)
  const classes = useStyles()

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Grid container justify="center" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Count:{count}
            </Typography>
          </Grid>
        </Grid>

        <Grid container justify="center" alignItems="center">
          <Grid item>
            <Button variant="outlined" color="primary" className={classes.button} onClick={() => increment()}>
              Increment
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" className={classes.button} onClick={() => decrement()}>
              Decrement
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="default" className={classes.button} onClick={() => reset()}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Counter

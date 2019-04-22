import React, { FunctionComponent, useState } from 'react'
//import App from '../components/App'
import { TextField } from '@material-ui/core'

const LoginForm: FunctionComponent = () => {
  const [name, setName] = useState(undefined)
  const [password, setPassword] = useState(name)

  return (
    <>
      <form>
        <TextField
          id="outlined-name"
          label="name"
          value={name}
          onChange={e => setName(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          margin="normal"
          variant="outlined"
        />
      </form>
    </>
  )
}

export default LoginForm

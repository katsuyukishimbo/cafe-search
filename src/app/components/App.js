import React, { createContext } from 'react'

const CounterContext = createContext()

const Provider = ({ children }) => {
  return <CounterContext.Provider>{children}</CounterContext.Provider>
}

export { Provider }

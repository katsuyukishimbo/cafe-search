import * as React from 'react'
import App from '../components/App'
import SearchForm from '../components/Search'

export default () => (
  <>
    <App>
      <p>Index Page</p>
    </App>
    <SearchForm label="test" name="test" defaultValue="test" />
  </>
)

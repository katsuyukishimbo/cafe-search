// https://github.com/zeit/next.js/#custom-app
/**
 * React
 */
import React from 'react'
/**
 * Next
 */
import App, { Container } from 'next/app'

/**
 * Mui
 */
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../config/theme'

/**
 * Contexts
 */
import { Provider } from '../components/App'

/**
 * MuiApp
 * ここでContextのProvider設定しておくと良い
 */
class MuiApp extends App {
  // componentDidMount() {
  //   // サーバーサイドに挿入されたCSSが存在すればを削除します
  //   const jssStyles = document.querySelector('#jss-server-side');
  //   if (jssStyles && jssStyles.parentNode) {
  //     jssStyles.parentNode.removeChild(jssStyles);
  //   }
  // }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Provider>
            {/* Material-UIでのベースライン、ないとデザインが崩れる */}
            <CssBaseline />
            <Component {...pageProps} />
          </Provider>
        </ThemeProvider>
      </Container>
    )
  }
}

export default MuiApp

import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import App from 'next/app'
import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks';
import Head from 'next/head';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossOrigin="anonymous"
          />
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}
export default MyApp

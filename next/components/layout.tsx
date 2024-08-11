import React from 'react'

import { getCookie } from 'cookies-next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const AppThemeProvider = dynamic(() => import('./AppThemeProvider'), { ssr: false })

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = getCookie('__theme__') || 'light'

  return (
    <>
      <Head>
        <title>Github repositories</title>
        <meta name='description' content='Github repositories' />
      </Head>
      <AppThemeProvider attribute='class' defaultTheme={theme} enableSystem>
        <div id='root'>{children}</div>
      </AppThemeProvider>
    </>
  )
}

'use client'

import React from 'react'

import { getCookie } from 'cookies-next'

import AppThemeProvider from './components/AppThemeProvider'
import GalleryView from './components/GalleryView/GalleryView'
//import { Log, LogError } from '../next/utils/utils'
import { RepositoriesSearchResult, Repository } from './data/types'

export default function GalleryPage({
  repoSearch,
  repoDetails,
}: {
  repoSearch: RepositoriesSearchResult
  repoDetails?: Repository
}) {
  const theme = getCookie('__theme__') || 'light'

  return (
    <AppThemeProvider attribute='class' defaultTheme={theme} enableSystem>
      <GalleryView repoSearch={repoSearch} repoDetails={repoDetails}></GalleryView>
    </AppThemeProvider>
  )
}

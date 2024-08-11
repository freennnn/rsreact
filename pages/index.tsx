// disabling next fast refresh eslint rule as it contradict to the very Next.js nature:

/* eslint-disable  react-refresh/only-export-components */
import React from 'react'

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import GalleryView from '../next/components/GalleryView/GalleryView'
import Layout from '../next/components/layout'
//import { Log, LogError } from '../next/utils/utils'
import { getRepositores, getRepository } from '../next/data/api'
import { RepositoriesSearchResult, Repository } from '../next/data/types'

export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  //Log(context.query)
  const searchTerm = context.query.search as string | undefined
  const pageNumber = Number(context.query.page as string)
  const repoSearch = await getRepositores(searchTerm, pageNumber)
  const repoOwner = context.query.owner as string | undefined
  const repoName = context.query.name as string | undefined
  let repoDetails: undefined | Repository = undefined
  if (repoOwner && repoName) repoDetails = await getRepository(repoOwner, repoName)
  // Pass data to the page via props
  if (repoDetails) {
    return { props: { repoSearch, repoDetails } }
  } else {
    return { props: { repoSearch } }
  }
}) satisfies GetServerSideProps<{
  repoSearch: RepositoriesSearchResult
  repoDetails?: Repository
}>

export default function GalleryPage({
  repoSearch,
  repoDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <GalleryView repoSearch={repoSearch} repoDetails={repoDetails}></GalleryView>
    </Layout>
  )
}

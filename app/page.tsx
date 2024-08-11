import GalleryPageClient from './GalleryPageClient'
import { getRepositores, getRepository } from './data/api'
import { RepositoriesSearchResult, Repository } from './data/types'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = searchParams['search'] as string | undefined
  const page = Number(searchParams['page'] as string)
  const repoOwner = searchParams['owner'] as string | undefined
  const repoName = searchParams['name'] as string | undefined
  const repoSearchResults = (await getRepositores(search, page)) as RepositoriesSearchResult
  let repoDetails: undefined | Repository = undefined
  if (repoOwner && repoName) repoDetails = await getRepository(repoOwner, repoName)

  return <GalleryPageClient repoSearch={repoSearchResults} repoDetails={repoDetails} />
}

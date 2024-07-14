import { BrowserRouter, Params } from 'react-router-dom'

import { render, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'

import CardDetails from '../../views/CardDetails/CardDetails'
import server from '../mock-api-server'

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom')
  return {
    ...mod,
    useParams: (): Readonly<Params<string>> => ({ owner: 'mockedOwner', name: 'mockedName' }),
  }
})

beforeEach(() => {
  server.use(
    http.get('https://api.github.com/repos/mockedOwner/mockedName', () => {
      return HttpResponse.json({
        allow_forking: true,
        archive_url: 'https://api.github.com/repos/duxianwei520/react/{archive_format}{/ref}',
        archived: false,
        assignees_url: 'https://api.github.com/repos/duxianwei520/react/assignees{/user}',
        blobs_url: 'https://api.github.com/repos/duxianwei520/react/git/blobs{/sha}',
        branches_url: 'https://api.github.com/repos/duxianwei520/react/branches{/branch}',
        clone_url: 'https://github.com/duxianwei520/react.git',
        collaborators_url:
          'https://api.github.com/repos/duxianwei520/react/collaborators{/collaborator}',
        comments_url: 'https://api.github.com/repos/duxianwei520/react/comments{/number}',
        commits_url: 'https://api.github.com/repos/duxianwei520/react/commits{/sha}',
        compare_url: 'https://api.github.com/repos/duxianwei520/react/compare/{base}...{head}',
        contents_url: 'https://api.github.com/repos/duxianwei520/react/contents/{+path}',
        contributors_url: 'https://api.github.com/repos/duxianwei520/react/contributors',
        created_at: '2016-12-02T13:08:43Z',
        default_branch: 'master',
        deployments_url: 'https://api.github.com/repos/duxianwei520/react/deployments',
        description: ' React+webpack+redux+ant design+axios+less全家桶后台管理框架',
        disabled: false,
        downloads_url: 'https://api.github.com/repos/duxianwei520/react/downloads',
        events_url: 'https://api.github.com/repos/duxianwei520/react/events',
        fork: false,
        forks: 1745,
        forks_count: 1745,
        forks_url: 'https://api.github.com/repos/duxianwei520/react/forks',
        full_name: 'duxianwei520/react',
        git_commits_url: 'https://api.github.com/repos/duxianwei520/react/git/commits{/sha}',
        git_refs_url: 'https://api.github.com/repos/duxianwei520/react/git/refs{/sha}',
        git_tags_url: 'https://api.github.com/repos/duxianwei520/react/git/tags{/sha}',
        git_url: 'git://github.com/duxianwei520/react.git',
        has_discussions: false,
        has_downloads: true,
        has_issues: true,
        has_pages: true,
        has_projects: true,
        has_wiki: true,
        homepage: '',
        hooks_url: 'https://api.github.com/repos/duxianwei520/react/hooks',
        html_url: 'https://github.com/duxianwei520/react',
        id: 75396575,
        is_template: false,
        issue_comment_url:
          'https://api.github.com/repos/duxianwei520/react/issues/comments{/number}',
        issue_events_url: 'https://api.github.com/repos/duxianwei520/react/issues/events{/number}',
        issues_url: 'https://api.github.com/repos/duxianwei520/react/issues{/number}',
        keys_url: 'https://api.github.com/repos/duxianwei520/react/keys{/key_id}',
        labels_url: 'https://api.github.com/repos/duxianwei520/react/labels{/name}',
        language: 'JavaScript',
        languages_url: 'https://api.github.com/repos/duxianwei520/react/languages',
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz',
        },
        merges_url: 'https://api.github.com/repos/duxianwei520/react/merges',
        milestones_url: 'https://api.github.com/repos/duxianwei520/react/milestones{/number}',
        mirror_url: null,
        name: 'react',
        network_count: 1745,
        node_id: 'MDEwOlJlcG9zaXRvcnk3NTM5NjU3NQ==',
        notifications_url:
          'https://api.github.com/repos/duxianwei520/react/notifications{?since,all,participating}',
        open_issues: 22,
        open_issues_count: 22,
        owner: {
          avatar_url: 'https://avatars.githubusercontent.com/u/3249653?v=4',
          events_url: 'https://api.github.com/users/duxianwei520/events{/privacy}',
          followers_url: 'https://api.github.com/users/duxianwei520/followers',
          following_url: 'https://api.github.com/users/duxianwei520/following{/other_user}',
          gists_url: 'https://api.github.com/users/duxianwei520/gists{/gist_id}',
          gravatar_id: '',
          html_url: 'https://github.com/duxianwei520',
          id: 3249653,
          login: 'duxianwei520',
          node_id: 'MDQ6VXNlcjMyNDk2NTM=',
          organizations_url: 'https://api.github.com/users/duxianwei520/orgs',
          received_events_url: 'https://api.github.com/users/duxianwei520/received_events',
          repos_url: 'https://api.github.com/users/duxianwei520/repos',
          site_admin: false,
          starred_url: 'https://api.github.com/users/duxianwei520/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/duxianwei520/subscriptions',
          type: 'User',
          url: 'https://api.github.com/users/duxianwei520',
        },

        private: false,
        pulls_url: 'https://api.github.com/repos/duxianwei520/react/pulls{/number}',
        pushed_at: '2024-06-20T19:02:50Z',
        releases_url: 'https://api.github.com/repos/duxianwei520/react/releases{/id}',
        size: 2836,
        ssh_url: 'git@github.com:duxianwei520/react.git',
        stargazers_count: 4999,
        stargazers_url: 'https://api.github.com/repos/duxianwei520/react/stargazers',
        statuses_url: 'https://api.github.com/repos/duxianwei520/react/statuses/{sha}',
        subscribers_count: 196,
        subscribers_url: 'https://api.github.com/repos/duxianwei520/react/subscribers',
        subscription_url: 'https://api.github.com/repos/duxianwei520/react/subscription',
        svn_url: 'https://github.com/duxianwei520/react',
        tags_url: 'https://api.github.com/repos/duxianwei520/react/tags',
        teams_url: 'https://api.github.com/repos/duxianwei520/react/teams',
        temp_clone_token: null,
        topics: ['ant-design-pro', 'antd', 'babel', 'es6', 'es7', 'react', 'redux', 'webpack'],
        trees_url: 'https://api.github.com/repos/duxianwei520/react/git/trees{/sha}',
        updated_at: '2024-07-14T13:24:13Z',
        url: 'https://api.github.com/repos/duxianwei520/react',
        visibility: 'public',
        watchers: 4999,
        watchers_count: 4999,
        web_commit_signoff_required: false,
      })
    }),
  )
})

it('renders CardDetails with mocked JSON', async () => {
  render(
    <BrowserRouter>
      <CardDetails />
    </BrowserRouter>,
  )

  expect(await screen.findByText(/duxianwei520/)).toBeInTheDocument()
})

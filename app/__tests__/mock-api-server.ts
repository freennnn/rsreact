import { setupServer } from 'msw/node'

const server = setupServer()
server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url)
})
export default server

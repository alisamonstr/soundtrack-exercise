import { initGraphQLTada } from 'gql.tada'
import { Client, fetchExchange, subscriptionExchange } from 'urql'
import { createClient as createWSClient } from 'graphql-ws'
import type { introspection } from './graphql.generated.d.ts'

export const graphql = initGraphQLTada<{
  disableMasking: true
  introspection: introspection
  scalars: {
    Url: string
    Date: string
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada'
export { readFragment, maskFragments } from 'gql.tada'

const wsClient = createWSClient({
  url: 'wss://api.soundtrackyourbrand.com/v2/graphql-transport-ws',
})

export const client = new Client({
  url: 'https://api.soundtrackyourbrand.com/v2',
  exchanges: [
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || '' }
        return {
          subscribe(sink) {
            const unsubscribe = wsClient.subscribe(input, sink)
            return { unsubscribe }
          },
        }
      },
    }),
  ],
})

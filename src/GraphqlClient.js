import React from 'react'
import { onError } from '@apollo/client/link/error'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, ApolloLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const { REACT_APP_GRAPHQL_URI, REACT_APP_GRAPHQL_WS_URI, NODE_ENV } = process.env

const wsLink = new GraphQLWsLink(createClient({ url: REACT_APP_GRAPHQL_WS_URI }))

const httpLink = new HttpLink({ uri: REACT_APP_GRAPHQL_URI })

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  mutate: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  }
}

const errorLink = onError(({ graphQLErrors, networkError, response, operation, forward }) => {
  graphQLErrors && graphQLErrors.forEach(({ message, locations, path }) => {
    if (NODE_ENV === 'development') {
      console.log('GraphqlClient errorLink: ', '\nmessage', message, '\nlocations', locations, '\npath', path)
    }
  })

  if (networkError) {
    if (NODE_ENV === 'development') {
      console.log('GraphqlClient errorLink', 'networkError', networkError)
    }
  }
  return forward(operation)
})

const GraphqlClient = ({ children, user }) => {
  const setHeaders = new ApolloLink((operation, forward) => {
    const requiredHeaders = {
      'Content-Type': 'application/json'
    }

    operation.setContext(({ headers }) => ({
      headers: {
        ...requiredHeaders,
        ...headers
      }
    }))

    return forward(operation)
  })

  const client = new ApolloClient({
    link: from([setHeaders, errorLink, splitLink]),
    cache: new InMemoryCache(),
    credentials: 'include',
    defaultOptions
  })

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

export default GraphqlClient

import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import resolvers from './resolvers';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db },
})
server.start({ port: 8000 }, ({ port }) => {
  console.log(`Server is up on ${port}...`)
})

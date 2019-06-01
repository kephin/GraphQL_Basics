import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import resolvers from './resolvers'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db, pubsub },
})

server.start({ port: 8000 }, ({ port }) => {
  console.log(`Server is up on ${port}...`)
})

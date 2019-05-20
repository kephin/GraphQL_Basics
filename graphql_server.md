# GraphQL Server

## Install [graphql-yoga](https://github.com/prisma/graphql-yoga)

```zsh
npm i graphql-yoga
```

In the server.js

```javascript
import { GraphQLServer } from 'graphql-yoga'

// Type definition(Schema)
const typeDefs = `
  type Query {
    hello: String!
  }
`

// Resolvers
const resolvers = {
  Query: {
    hello() { return 'hello world' },
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ port: 8000 }, ({ port }) => {
  console.log(`Server is up on ${port}...`)
})
```

# GraphQL Basics: Schema and Queries

## Define schema

We define the schema by **typeDefs** and **resolvers**

`typeDefs`(schema) is to define *operations* we want the server to support and define *custom types*.

There are scalar types and non-scalar types.

| Types | Contents | Stores |
| ----- | -------- | ------ |
| Scalar types | ID, String, Boolean, Int, Float | single discrete value |
| Non-scalar types | object, array | a collection of scalar values |

`resolvers` contains the code that runs when an operation is executed

```javascript
// Type definition(Schema)
const typeDefs = `
  type Query {
    // scalar type
    hello: String!

    // custom type
    users: [User!]!
    config: Config!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
  }
  type Config {
    premium: Boolean!
    theme: String!
    font: Int!
  }
`

// Resolvers
const resolvers = {
  Query: {
    hello() { return 'hello world' },
    config() {
      return {
        premium: false, theme: 'panda', font: 12,
      }
    },
    users() {
      return [
        { id: '123', name: 'kevin', email: 'kevin@graphql.com' },
        { id: '456', name: 'allen', email: 'allen@graphql.com' },
      ]
    },
  },
}
```

## How to define Custom Types

1. Create a custom type in typeDefs
2. Add scalar field in the custom type

    ```javascript
    const typeDefs = `
      type Config {
        premium: Boolean!
        theme: String!
        font: Int!
      }
      type Post {
        id: ID!
        title: String!
        body: String!
        created_at: Int!
      }
    `
    ```

3. Define a query

    ```javascript
    const typeDefs = `
      type Query {
        config: Config!
        posts: [Post!]!
      }
      type Config {
        premium: Boolean!
        theme: String!
        font: Int!
      }
      type Post {
        id: ID!
        title: String!
        body: String!
        created_at: Int!
      }
    `
    ```

4. Setup resolver method inside Query field

    ```javascript
    const resolvers = {
      Query: {
        config() {
          return {
            premium: false, theme: 'panda', font: 12,
          }
        },
        posts() {
          return [
            { id: '123', title: 'JavaScript', body: 'I like JS!', created_at: 1545637156986 },
            { id: '456', title: 'GraphQL', body: 'Learning GraphQL!', created_at: 1545637937827 },
          ]
        },
      },
    }
    ```

5. Query certain fields in config object and posts array

    ```graphql
    query {
      config {
        premium
        theme
        font
      }
      posts {
        id
        title
        body
      }
    }
    ```

## Operation Argument

:bulb: Allow us to pass data from the client to the GraphQL server

For example, like signing up or fetch specific data by ID.

We need to explicitly define the arguments it accepts. Arguments can be any type, including scalar type as well as custom type. Arguments can be required or optional.

```javascript
const typeDefs = `
  type Query {
    add(numbers: [Float!]!): Float!
    post(id: ID!): Post!
    posts(query: String!): [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    created_at: Int!
  }
`

const resolvers = {
  Query: {
    add(parent, args, ctx, info) {
      return args.numbers.reduce((acc, cur) => acc + cur, 0)
    }
    async post(parent, args, ctx, info) {
      try {
        const post = await Post.findById(args.id)
        return post
      } catch (err) {
        return err
      }
    },
    async posts(parent, args, ctx, info) {
      try {
        const posts = await Post.find({ title: args.query })
        return posts
      } catch (err) {
        return err
      }
    },
  },
}
```

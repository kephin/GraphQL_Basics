# Relational Data

Setting up relationships between your custom types allows you to query based on those relationships.

## Setting up Association

Relation: `User` has many `Posts`, `Post` belongs to one `User`

```javascript
const typeDefs = `
  type Query {
    user(id: ID!): User!
    users: [User!]!
    post(id: ID!): Post!
    posts(query: String): [Post!]!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
```

The relationship requires a new resolver method, which is responsible for returning the user for a given post.

:star: Notice that the author method below lives on a new Post property. For associations, the root property name needs to match up with the object type name. The method name needs to match up with the new field name.

The post data is provided via the first argument, which is typically named **parent**.

```javascript
const resolvers = {
  Query: {
    // ...
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.authorId === parent.id)
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.authorId)
    }
  },
}
```

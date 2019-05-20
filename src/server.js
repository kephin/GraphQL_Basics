import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

let users = [
  { id: '111', name: 'kevin', email: 'kevin@graphql.com' },
  { id: '222', name: 'allen', email: 'allen@graphql.com' },
  { id: '333', name: 'chris', email: 'chris@graphql.com' },
]
let posts = [
  { id: '123', title: 'GraphQL', body: 'GraphQL rocks', published: true, authorId: '111' },
  { id: '456', title: 'React', body: 'React is nice', published: false, authorId: '222' },
  { id: '789', title: 'Redux', body: 'Redux is good', published: true, authorId: '333' },
]
let comments = [
  { id: '999', text: "Can't agree you more!", postId: '456', authorId: '222' },
  { id: '888', text: 'What...?!', postId: '123', authorId: '222' },
  { id: '777', text: 'Bull shit', postId: '456', authorId: '111' },
  { id: '666', text: 'Okay', postId: '123', authorId: '111' },
  { id: '555', text: 'Woooooo', postId: '789', authorId: '111' },
]

// Type definition(Schema)
const typeDefs = `
  type Query {
    config: Config!
    user(id: ID!): User!
    users: [User!]!
    post(id: ID!): Post!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }
  type Mutation {
    createUser(user: createUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(post: createPostInput!): Post!
    createComment(comment: createCommentInput!): Comment!
  }
  input createUserInput {
    name: String!,
    email: String!,
    age: Int
  }
  input createPostInput {
    title: String!,
    body: String!,
    published: Boolean!,
    authorId: ID!
  }
  input createCommentInput {
    text: String!,
    authorId: ID!,
    postId: ID!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    config() {
      return {
        premium: false, theme: 'panda', font: 12,
      }
    },
    users() {
      return users
    },
    user(parent, args, ctx, info) {
      return users.find(user => user.id === args.id)
    },
    posts(parent, args, ctx, info) {
      if (!args.query) return posts

      return posts.filter(post => post.title
        .concat(post.body)
        .toLowerCase()
        .includes(args.query.toLowerCase()))
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === args.id)
    },
    comments(parent, args, ctx, info) {
      return comments
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const isEmailTaken = users.some(user => user.email === args.user.email)
      if (isEmailTaken) throw new Error('Email is taken')
      const newUser = {
        id: uuidv4(),
        ...args.user,
      }
      users.push(newUser)
      return newUser
    },
    deleteUser(parent, args, ctx, info) {
      const user = users.find(user => user.id === args.id)
      if (!user) throw Error('User not found')
      users = users.filter(user => user.id !== args.id)
      posts = posts.filter(post => {
        const isMatch = post.authorId === args.id
        if (isMatch) comments = comments.filter(comment => comment.postId !== post.id)
        return !isMatch
      })
      comments = comments.filter(comment => comment.authorId !== args.id)
      return user
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.post.authorId)
      if (!userExists) throw new Error('User not found')
      const newPost = {
        id: uuidv4(),
        ...args.post,
      }
      posts.push(newPost)
      return newPost
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.comment.authorId)
      const postExists = posts.some(post => post.id === args.comment.postId && post.published)
      if (!postExists) throw Error('Unable to find user or post')
      const newComment = {
        id: uuidv4(),
        ...args.comment,
      }
      comments.push(newComment)
      return newComment
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.authorId === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.authorId === parent.id)
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.authorId)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.postId === parent.id)
    },
  },
  Comment: {
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.postId)
    },
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.authorId)
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({ port: 8000 }, ({ port }) => {
  console.log(`Server is up on ${port}...`)
})

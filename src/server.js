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
      const user = users.find(user => user.id === args.userId)
      if (!user) throw Error('User not found')
      users = users.filter(user => user.id !== args.userId)
      posts = posts.filter(post => {
        const isMatch = post.authorId === args.userId
        if (isMatch) comments = comments.filter(comment => comment.postId !== post.id)
        return !isMatch
      })
      comments = comments.filter(comment => comment.authorId !== args.userId)
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
    deletePost(parent, args, ctx, info) {
      const post = posts.find(post => post.id === args.postId)
      if (!post) throw Error('Post not found')
      posts = posts.filter(post => post.id !== args.postId)
      comments = comments.filter(comment => comment.postId !== args.postId)
      return post
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
    deleteComment(parent, args, ctx, info) {
      const comment = comments.find(comment => comment.id === args.commentId)
      if (!comment) throw Error('Comment not found')
      comments = comments.filter(comment => comment.id !== args.commentId)
      return comment
    }
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

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})
server.start({ port: 8000 }, ({ port }) => {
  console.log(`Server is up on ${port}...`)
})

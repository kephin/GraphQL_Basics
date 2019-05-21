const users = [
  { id: '111', name: 'kevin', email: 'kevin@graphql.com' },
  { id: '222', name: 'allen', email: 'allen@graphql.com' },
  { id: '333', name: 'chris', email: 'chris@graphql.com' },
]
const posts = [
  { id: '123', title: 'GraphQL', body: 'GraphQL rocks', published: true, authorId: '111' },
  { id: '456', title: 'React', body: 'React is nice', published: false, authorId: '222' },
  { id: '789', title: 'Redux', body: 'Redux is good', published: true, authorId: '333' },
]
const comments = [
  { id: '999', text: "Can't agree you more!", postId: '456', authorId: '222' },
  { id: '888', text: 'What...?!', postId: '123', authorId: '222' },
  { id: '777', text: 'Bull shit', postId: '456', authorId: '111' },
  { id: '666', text: 'Okay', postId: '123', authorId: '111' },
  { id: '555', text: 'Woooooo', postId: '789', authorId: '111' },
]

const db = {
  users,
  posts,
  comments
}

export default db

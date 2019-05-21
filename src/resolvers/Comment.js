const Comment = {
  post(parent, args, { db }, info) {
    return db.posts.find(post => post.id === parent.postId)
  },
  author(parent, args, { db }, info) {
    return db.users.find(user => user.id === parent.authorId)
  },
}

export default Comment

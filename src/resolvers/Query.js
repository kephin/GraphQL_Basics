const Query = {
  config() {
    return {
      premium: false, theme: 'panda', font: 12,
    }
  },
  users(parent, args, { db }, info) {
    return db.users
  },
  user(parent, args, { db }, info) {
    return db.users.find(user => user.id === args.id)
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts

    return db.posts.filter(post => post.title
      .concat(post.body)
      .toLowerCase()
      .includes(args.query.toLowerCase()))
  },
  post(parent, args, { db }, info) {
    return db.posts.find(post => post.id === args.id)
  },
  comments(parent, args, { db }, info) {
    return db.comments
  },
}

export default Query

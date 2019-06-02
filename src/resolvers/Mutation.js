import uuidv4 from 'uuid/v4'

const Mutation = {
  createUser(parent, args, { db }, info) {
    const isEmailTaken = db.users.some(user => user.email === args.user.email)
    if (isEmailTaken) throw new Error('Email is taken')
    const newUser = {
      id: uuidv4(),
      ...args.user,
    }
    db.users.push(newUser)
    return newUser
  },
  deleteUser(parent, args, { db }, info) {
    const user = db.users.find(user => user.id === args.userId)
    if (!user) throw new Error('User not found')
    db.users = db.users.filter(user => user.id !== args.userId)
    db.posts = db.posts.filter(post => {
      const isMatch = post.authorId === args.userId
      if (isMatch) db.comments = db.comments.filter(comment => comment.postId !== post.id)
      return !isMatch
    })
    db.comments = db.comments.filter(comment => comment.authorId !== args.userId)
    return user
  },
  updateUser(parent, args, { db }, info) {
    const { userId, data } = args
    const isEmailTaken = db.users.some(user => user.email === data.email)
    if (isEmailTaken) throw new Error('Email is taken')

    const user = db.users.find(user => user.id === userId)
    if (!user) throw new Error('User not found')
    const userIndex = db.users.indexOf(user)
    const updatedUser = { ...user, ...data }
    db.users.splice(userIndex, 1, updatedUser)
    return updatedUser
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.post.authorId)
    if (!userExists) throw new Error('User not found')
    const newPost = {
      id: uuidv4(),
      ...args.post,
    }
    db.posts.push(newPost)
    if (args.post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATE',
          data: newPost
        }
      })
    }
    return newPost
  },
  deletePost(parent, args, { db }, info) {
    const post = db.posts.find(post => post.id === args.postId)
    if (!post) throw new Error('Post not found')
    db.posts = db.posts.filter(post => post.id !== args.postId)
    db.comments = db.comments.filter(comment => comment.postId !== args.postId)
    return post
  },
  updatePost(parent, args, { db }, info) {
    const { postId, data } = args
    const post = db.posts.find(post => post.id === postId)
    if (!post) throw new Error('Post not found')
    const index = db.posts.indexOf(post)
    const updatedPost = { ...post, ...data }
    db.posts.splice(index, 1, updatedPost)
    return updatedPost
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.comment.authorId)
    const postExists = db.posts.some(post => post.id === args.comment.postId && post.published)
    if (!postExists || !userExists) throw new Error('Unable to find user or post')
    const newComment = {
      id: uuidv4(),
      ...args.comment,
    }
    db.comments.push(newComment)
    pubsub.publish(`comment-${args.comment.postId}`, { comment: newComment })
    return newComment
  },
  deleteComment(parent, args, { db }, info) {
    const comment = db.comments.find(comment => comment.id === args.commentId)
    if (!comment) throw new Error('Comment not found')
    db.comments = db.comments.filter(comment => comment.id !== args.commentId)
    return comment
  },
  updateComment(parent, args, { db }, info) {
    const { commentId, data } = args
    const comment = db.comments.find(comment => comment.id === commentId)
    if (!comment) throw new Error('Comment not found')
    const index = db.comments.indexOf(comment)
    const updatedComment = { ...comment, ...data }
    db.comments.splice(index, 1, updatedComment)
    return updatedComment
  }
}

export default Mutation

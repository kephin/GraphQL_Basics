const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find(post => post.published && post.id === postId)
      if (!post) throw new Error('Post not found')
      return pubsub.asyncIterator(`comment-${postId}`)
    }
  }
}

export default Subscription

const route = require('express').Router()
const { admin } = require('../config')
const db = admin.firestore()

const { authorizeUser } = require('../middlewares')

// TODO: create index to query from firestore the comments on posts

/**
 * @route         /api/posts/ GET
 * @access        public
 * @description   fetch all posts
 */

route.get('/', (req, res) => {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((docs) => {
      const posts = []

      docs.forEach((doc) => {
        const docData = doc.data()

        posts.push({
          postId: doc.id,
          body: docData.body,
          userHandle: docData.userHandle,
          userImage: docData.imageUrl,
          createdAt: docData.createdAt,
          likeCount: docData.likeCount,
          commentCount: docData.commentCount,
        })
      })

      return res.json(posts)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route         /api/posts/:postId  GET
 * @access        public
 * @description   fetch one post
 */

route.get('/:postId', (req, res) => {
  let postData = {}

  const postId = req.params.postId
  if (!postId) return res.status(400).json({ error: 'Must provide postId' })

  db.doc(`/posts/${postId}`)
    .get()

    .then((doc) => {
      if (!doc.exists) return res.status(404).json({ error: 'Post not found' })

      postData = doc.data()
      postData.postId = doc.id

      return db
        .collection('comments')
        .where('postId', '==', postId)
        .orderBy('createdAt', 'desc')
        .get()
    })

    .then((docs) => {
      postData.comments = []
      docs.forEach((doc) => {
        postData.comments.push(doc.data())
      })

      return res.json(postData)
    })

    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route         /api/posts/   POST
 * @access        private
 * @description   add a new post
 */

route.post('/', authorizeUser, (req, res) => {
  const postBody = req.body.body
  if (!postBody) return res.status(400).json({ error: 'Post body is required' })
  if (postBody.length < 2)
    return res.status(400).json({ error: 'Post body at least 2 char' })

  const newPost = {
    body: postBody,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
  }

  db.collection('posts')
    .add(newPost)
    .then((doc) => {
      newPost.postId = doc.id
      return res.json(newPost)
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal server error' })
      return console.error(err)
    })
})

/**
 * @route         /api/posts/:postId/comment POST
 * @access        private
 * @description   comment on a post
 */

route.post('/:postId/comment', authorizeUser, (req, res) => {
  const postId = req.params.postId
  if (!postId) return res.status(400).json({ error: 'Must provide postId' })

  let commentBody
  if (req.body.comment) commentBody = req.body.comment.trim()
  if (!commentBody) return res.status(400).json({ error: 'Must provide a comment' })

  // ?? undefined values are not allowed
  const newComment = {
    postId: postId,
    body: commentBody,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
  }

  db.doc(`/posts/${postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(400).json({ error: 'Post not found' })

      // ?? should add comment first
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
    })
    .then(() => {
      return db.collection('comments').add(newComment)
    })
    .then(() => {
      return res.json(newComment)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route         /api/posts/:postId/like GET
 * @access        private
 * @description   like a post
 */

route.get('/:postId/like', authorizeUser, (req, res) => {
  const postId = req.params.postId
  if (!postId) return res.status(400).json({ error: 'Must provide postId' })

  const userHandle = req.user.handle

  const likeDoc = db
    .collection('likes')
    .where('userHandle', '==', userHandle)
    .where('postId', '==', postId)
    .limit(1)

  let postData
  const postDoc = db.doc(`/posts/${postId}`)

  postDoc
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(400).json({ error: 'Post not found' })

      postData = doc.data()
      postData.postId = doc.id

      return likeDoc.get()
    })
    .then((data) => {
      if (!data.empty) {
        res.status(400).json({ error: 'Post already liked' })
        throw { name: 'alreadyLiked' } // ?? check better error handler
      }

      return db.collection('likes').add({ postId, userHandle })
    })
    .then(() => {
      postData.likeCount++
      return postDoc.update({ likeCount: postData.likeCount })
    })
    .then(() => {
      return res.json(postData)
    })
    .catch((err) => {
      if (err.name === 'alreadyLiked') return

      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route         /api/posts/:postId/unlike
 * @access        private
 * @description   unlike a post
 */

route.get('/:postId/unlike', authorizeUser, (req, res) => {
  const userHandle = req.user.handle

  const postId = req.params.postId
  if (!postId) return res.status(400).json({ error: 'Must provide postId' })

  let postData
  const postDoc = db.doc(`/posts/${postId}`)

  const likeDoc = db
    .collection('likes')
    .where('userHandle', '==', userHandle)
    .where('postId', '==', postId)
    .limit(1)

  postDoc
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(400).json({ error: 'Post not found' })

      postData = doc.data()
      postData.postId = doc.id

      return likeDoc.get()
    })
    .then((data) => {
      if (data.empty) {
        res.status(400).json({ error: 'Post is not liked' })
        throw { name: 'notLiked' }
      }

      return db.doc(`/likes/${data.docs[0].id}`).delete()
    })
    .then(() => {
      postData.likeCount--
      return postDoc.update({ likeCount: postData.likeCount })
    })
    .then(() => {
      return res.json(postData)
    })
    .catch((err) => {
      if (err.name === 'notLiked') return

      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route         /api/posts/:postId/   DELETE
 * @access        private
 * @description   delete a post
 */

route.delete('/:postId', authorizeUser, (req, res) => {
  const userHandle = req.user.handle

  const postId = req.params.postId
  if (!postId) return res.status(400).json({ error: 'Must provide postId' })

  const postDoc = db.doc(`/posts/${postId}`)

  postDoc
    .get()
    .then((doc) => {
      if (!doc.exists) return res.status(400).json({ error: 'Post not found' })

      if (doc.data().userHandle !== userHandle)
        return res.status(403).json({ error: 'Unauthorized to delete post' })

      return postDoc.delete()
    })
    .then(() => {
      return res.json({ message: 'Post deleted successfully' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})

//

module.exports = route

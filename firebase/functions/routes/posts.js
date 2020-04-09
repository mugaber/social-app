const router = require('express').Router()
const { admin } = require('../config')
const { authorizeUser } = require('../middlewares')

const db = admin.firestore()

/**
 * @route       api/posts GET
 * @access      public
 * @description returns all posts
 */

router.get('/', (req, res) => {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .get()

    .then((docs) => {
      const posts = []
      docs.forEach((doc) =>
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        })
      )

      return res.json(posts)
    })
    .catch((err) => console.error(err))
})

/**
 * @route       api/posts   POST
 * @access      private
 * @description add new post
 */

router.post('/', authorizeUser, (req, res) => {
  const postBody = req.body.body
  if (!postBody) return res.status(400).json({ error: 'Post body is required' })
  if (postBody.length < 2)
    return res.status(400).json({ error: 'Post body at least 2 char' })

  const newPost = {
    body: postBody,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
  }

  db.collection('posts')
    .add(newPost)

    .then((doc) => {
      return res.json({ message: `document ${doc.id} created successfully` })
    })

    .catch((err) => {
      res.status(500).json({ error: 'internal server error' })
      return console.error(err)
    })
})

module.exports = router

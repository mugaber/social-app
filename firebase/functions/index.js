const functions = require('firebase-functions')
const admin = require('firebase-admin')
const app = require('express')()

admin.initializeApp()

//

app.get('/posts', (req, res) => {
  admin
    .firestore()
    .collection('posts')
    .get()
    .then((docs) => {
      const posts = []
      docs.forEach((doc) =>
        posts.push({
          postId: doc.id,
          body: doc.body().body,
          userHandle: doc.body().userHandle,
          createdAt: doc.data().createdAt,
        })
      )

      return res.json(posts)
    })
    .catch((err) => console.error(err))
})

app.post('/posts', (req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  }

  admin
    .firestore()
    .collection('posts')
    .add(newPost)
    .then((doc) => {
      return res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch((err) => {
      res.status(500).json({ error: 'internal server error' })
      return console.error(err)
    })
})

exports.api = functions.https.onRequest(app)

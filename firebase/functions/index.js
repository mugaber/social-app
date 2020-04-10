const functions = require('firebase-functions')
const { initializeApp } = require('./config')
const app = require('express')()
initializeApp()

const {
  onDeletePost,
  onUserImageChange,
  createNotificationOnLike,
  deleteNotificationOnUnlike,
  createNotificationOnComment,
} = require('./middlewares')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const postsRoute = require('./routes/posts')

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/posts', postsRoute)

exports.api = functions.https.onRequest(app)

exports.onDeletePost = onDeletePost
exports.onUserImageChange = onUserImageChange
exports.createNotificationOnLike = createNotificationOnLike
exports.deleteNotificationOnUnlike = deleteNotificationOnUnlike
exports.createNotificationOnComment = createNotificationOnComment

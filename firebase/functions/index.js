const functions = require('firebase-functions')
const { initializeApp } = require('./config')
initializeApp()

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const postsRoute = require('./routes/posts')

const app = require('express')()

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/posts', postsRoute)

exports.api = functions.https.onRequest(app)

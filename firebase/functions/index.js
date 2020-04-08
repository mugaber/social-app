const functions = require('firebase-functions')
const { initializeApp } = require('./config')
initializeApp()

const app = require('express')()
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')

app.use('/', authRoute)
app.use('/', postsRoute)

exports.api = functions.https.onRequest(app)

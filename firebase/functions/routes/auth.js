const route = require('express').Router()
const { firebase, admin } = require('../config')
const config = require('../config/firebaseConfig')
const { validateSignup, validateLogin } = require('../utils')

const db = admin.firestore()

/**
 * @route        api/auth/login POST
 * @access       private
 * @description  login user
 */

route.post('/login', (req, res) => {
  const reqBody = req.body
  const user = {
    email: reqBody.email,
    password: reqBody.password,
  }

  const { errors, valid } = validateLogin(user)
  if (!valid) return res.status(400).json(errors)

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)

    .then((data) => {
      return data.user.getIdToken()
    })

    .then((token) => {
      return res.json({ token })
    })

    .catch((err) => {
      console.error(err)

      if (err.code === 'auth/wrong-password')
        return res.status(403).json({ general: 'Wrong credentials' })

      res.status(500).json({ error: err.code })
    })
})

/**
 * @route        api/auth/signup
 * @access       private
 * @description  signup users
 */

route.post('/signup', (req, res) => {
  const reqBody = req.body
  const newUser = {
    email: reqBody.email,
    handle: reqBody.handle,
    password: reqBody.password,
    confirmPass: reqBody.confirmPass,
  }

  const { errors, valid } = validateSignup(newUser)
  if (!valid) return res.status(400).json(errors)

  let userId, token

  db.doc(`/users/${newUser.handle}`)
    .get()

    .then((doc) => {
      if (doc.exists) return res.status(400).json({ handle: 'Handle is already taken' })

      return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
    })

    .then((data) => {
      userId = data.user.uid
      return data.user.getIdToken()
    })

    .then((tokenId) => {
      token = tokenId

      const userCredentials = {
        userId,
        email: newUser.email,
        handle: newUser.handle,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-img.png?alt=media`,
      }

      return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })

    .then(() => {
      return res.json({ token })
    })

    .catch((err) => {
      console.error(err)
      if (err.code === 'auth/email-already-in-use')
        return res.status(500).json({ email: 'Email is already taken' })

      return res.status(500).json({ error: err.code })
    })
})

//

module.exports = route

const admin = require('firebase-admin')
const firebase = require('firebase')

const firebaseConfig = require('./firebaseConfig')

const initializeApp = () => {
  firebase.initializeApp(firebaseConfig)
  admin.initializeApp()
}

module.exports = { initializeApp, firebase, admin }

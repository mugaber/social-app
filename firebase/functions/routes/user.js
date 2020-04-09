const route = require('express').Router()

const { authorizeUser } = require('../middlewares')
const { getProfileDetails } = require('../utils')

const config = require('../config/firebaseConfig')
const { admin } = require('../config')
const db = admin.firestore()

// protect this route
route.use(authorizeUser)

/**
 * @route       api/user/image POST
 * @access      private
 * @description users can upload their profile image
 */

route.post('/image', (req, res) => {
  const busBoy = require('busboy')
  const path = require('path')
  const os = require('os')
  const fs = require('fs')

  const busboy = new busBoy({ headers: req.headers })

  let imageFileName,
    imageToBeUploaded = {}

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg')
      return res.status(400).json({ error: 'Invalid image format' })

    const filenameArr = filename.split('.')
    const imageExtention = filenameArr[filenameArr.length - 1]
    imageFileName = `${Math.round(Math.random() * 1000000000000000)}.${imageExtention}`

    const filePath = path.join(os.tmpdir(), imageFileName)
    imageToBeUploaded = { filePath, mimetype }

    file.pipe(fs.createWriteStream(filePath))
  })

  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: { metadata: { contentType: imageToBeUploaded.mimetype } },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl })
      })
      .then(() => {
        return res.json({ message: 'Image updated successfully' })
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code })
      })
  })

  busboy.end(req.rawBody)
})

/**
 * @route       api/user/profile  POST
 * @access      private
 * @description users can add and update their profile info
 */

route.post('/profile', (req, res) => {
  const profileDetails = getProfileDetails(req.body)

  // check if there is at least one field
  if (!Object.keys(profileDetails).length)
    return res.status(400).json({ error: 'At least update one field' })

  db.doc(`/users/${req.user.handle}`)
    .update(profileDetails)
    .then(() => {
      return res.json({ message: 'Profile updated successfully' })
    })
    .catch(() => {
      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route        api/user GET
 * @access       private
 * @description  get authenticated user details and likes
 */

route.get('/', (req, res) => {
  let userData = {}

  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (!doc.exists) throw new Error('User not found') // unlikely

      userData.credentials = doc.data() // to get the doc as an obj
      return db.collection('likes').where('userHandle', '==', req.user.handle).get()
    })
    .then((docs) => {
      userData.likes = []

      docs.forEach((doc) => {
        userData.likes.push(doc.data())
      })

      return res.json(userData)
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code })
    })
})

//

module.exports = route

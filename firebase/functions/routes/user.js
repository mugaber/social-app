const route = require('express').Router()

const { authorizeUser } = require('../middlewares')
const { getProfileDetails } = require('../utils')

const config = require('../config/firebaseConfig')
const { admin } = require('../config')
const db = admin.firestore()

/**
 * @route       api/user/image POST
 * @access      private
 * @description users can upload their profile image
 */

route.post('/image', authorizeUser, (req, res) => {
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

route.post('/profile', authorizeUser, (req, res) => {
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
 * @description  get authenticated user details and notifications
 */

route.get('/', authorizeUser, (req, res) => {
  let userData = {}
  const userHandle = req.user.handle

  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (!doc.exists) throw new Error('User not found')

      userData.credentials = doc.data()
      return db.collection('likes').where('userHandle', '==', req.user.handle).get()
    })
    .then((docs) => {
      userData.likes = []

      docs.forEach((doc) => {
        userData.likes.push(doc.data())
      })

      return db
        .collection('notifications')
        .where('recipient', '==', userHandle)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
    })
    .then((data) => {
      userData.notifications = []

      data.docs.forEach((doc) => {
        const docData = doc.data()

        const notification = {
          createdAt: docData.createdAt,
          recipient: docData.recipient,
          sender: docData.sender,
          postId: docData.postId,
          notificationId: doc.id,
          type: docData.type,
          read: docData.read,
        }

        userData.notifications.push(notification)
      })

      return res.json(userData)
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route         /api/user/:handle GET
 * @access        public
 * @description   get user details and posts by handle
 */

route.get('/:handle', (req, res) => {
  let userData = {}
  const userHandle = req.params.handle

  db.doc(`/users/${userHandle}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: 'User does not exist' })
        throw { name: 'noUser' }
      }

      userData.user = doc.data()

      return db
        .collection('posts')
        .where('userHandle', '==', userHandle)
        .orderBy('createdAt', 'desc')
        .get()
    })
    .then((docs) => {
      userData.posts = []

      docs.forEach((doc) => {
        const docData = doc.data()

        userData.posts.push({
          postId: doc.id,
          body: docData.body,
          userImage: docData.userImage,
          userHandle: docData.userHandle,
          createdAt: docData.createdAt,
          likeCount: docData.likeCount,
          commentCount: docData.commentCount,
        })
      })

      return res.json(userData)
    })
    .catch((err) => {
      if (err.name === 'noUser') return

      return res.status(500).json({ error: err.code })
    })
})

/**
 * @route         /api/user/
 * @access        private
 * @description   markes seen notifications read
 */

route.post('/notifications', authorizeUser, (req, res) => {
  const batch = db.batch()

  req.body.notifications.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`)
    batch.update(notification, { read: true })
  })

  batch
    .commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})

//

module.exports = route

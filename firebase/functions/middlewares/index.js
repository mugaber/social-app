const functions = require('firebase-functions')
const { admin } = require('../config')
const db = admin.firestore()

//

const authorizeUser = (req, res, next) => {
  const authToken = req.headers.authorization

  if (!authToken || !authToken.startsWith('Bearer '))
    return res.status(403).json({ error: 'Unauthorized' })

  const idToken = authToken.split('Bearer ')[1]

  admin
    .auth()
    .verifyIdToken(idToken)

    .then((decodedToken) => {
      req.user = decodedToken
      return db.collection('users').where('userId', '==', req.user.uid).limit(1).get()
    })

    .then((data) => {
      req.user.handle = data.docs[0].data().handle
      req.user.imageUrl = data.docs[0].data().imageUrl
      return next()
    })

    .catch((err) => {
      console.error(err)
      res.status(403).json(err)
    })
}

// update posts and comments userImage when user changes it

const onUserImageChange = functions.firestore
  .document('/users/{userId}')
  .onUpdate((change) => {
    if (change.before.data().imageUrl === change.after.data().imageUrl) return true

    const batch = db.batch()

    return db
      .collection('posts')
      .where('userHandle', '==', change.before.data().handle)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          const post = db.doc(`/posts/${doc.id}`)
          batch.update(post, { userImage: change.after.data().imageUrl })
        })

        return batch.commit()
      })
      .catch((err) => {
        console.error(err)
      })
  })

//

const onDeletePost = functions.firestore
  .document('posts/{id}') // ?? check if it should be postId
  .onDelete((snapshot, context) => {
    const batch = db.batch()
    const postId = context.params.postId

    db.collection('likes')
      .where('postId', '==', postId)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`))
        })

        return db.collection('comments').where('postId', '==', postId).get()
      })
      .then((docs) => {
        docs.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`))
        })

        return db.collection('notifications').where('postId', '==', postId).get()
      })
      .then((docs) => {
        docs.forEach((doc) => {
          batch.delete(db.doc(`/notificatoins/${doc.id}`))
        })

        return batch.commit()
      })
      .catch((err) => {
        console.error(err)
      })
  })

//

const createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        // post user !== like user
        if (!doc.exists || doc.data().userHandle === snapshot.data().userHandle) return

        const newNotification = {
          createdAt: new Date().toISOString(),
          sender: snapshot.data().userHandle,
          recipient: doc.data().userHandle,
          postId: doc.id,
          type: 'like',
          read: false,
        }

        return db.doc(`/notifications/${snapshot.id}`).set(newNotification)
      })
      .catch((err) => {
        console.error(err)
      })
  })

//

const deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err)
      })
  })

//

const createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (!doc.exists || doc.data().userHandle === snapshot.data().userHandle) return

        const newNotification = {
          createdAt: new Date().toISOString(),
          sender: snapshot.data().userHandle,
          recipient: doc.data().userHandle,
          type: 'comment',
          postId: doc.id,
          read: false,
        }

        // notification id == comment id
        return db.doc(`/notifications/${snapshot.id}`).set(newNotification)
      })
      .catch((err) => {
        console.error(err)
      })
  })

//

module.exports = {
  authorizeUser,
  onDeletePost,
  onUserImageChange,
  createNotificationOnLike,
  deleteNotificationOnUnlike,
  createNotificationOnComment,
}

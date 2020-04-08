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
      req.user = decodedToken // user email handle and other stuff
      return db.collection('users').where('userId', '==', req.user.uid).limit(1).get()
    })

    .then((data) => {
      req.user.handle = data.docs[0].data().handle
      return next()
    })

    .catch((err) => {
      console.error(err)
      res.status(403).json(err)
    })
}

module.exports = { authorizeUser }

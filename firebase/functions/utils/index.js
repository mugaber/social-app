const isEmpty = (string) => {
  if (!string) return true
  if (string.trim() === '') return true
  return false
}

const isEmail = (email) => {
  const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi
  if (email.match(regex)) return true
  return false
}

const validateSignup = (newUser) => {
  let errors = {}

  if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty'
  if (!isEmail(newUser.email)) errors.email = 'Must be a valid email'
  if (isEmpty(newUser.email)) errors.email = 'Must not be empty'
  if (newUser.password !== newUser.confirmPass) errors.password = 'Passwords must match'
  if (isEmpty(newUser.password)) errors.password = 'Must not be empty'

  return {
    errors,
    valid: !Object.keys(errors).length ? true : false,
  }
}

validateLogin = (user) => {
  let errors = {}

  if (!isEmail(user.email)) errors.email = 'Must be a valid email'
  if (isEmpty(user.email)) errors.email = 'Must not be empty'
  if (isEmpty(user.password)) errors.password = 'Must not be empty'

  return {
    errors,
    valid: !Object.keys(errors).length ? true : false,
  }
}

const getProfileDetails = (body) => {
  const { bio, website, location } = body

  let profileDetails = {}

  if (!isEmpty(bio)) profileDetails.bio = bio
  if (!isEmpty(location)) profileDetails.location = location
  if (!isEmpty(website)) {
    if (website.trim().substring(0, 4) !== 'http') {
      profileDetails.website = `http://${website.trim()}`
    } else {
      profileDetails.website = website.trim()
    }
  }

  return profileDetails
}

module.exports = { isEmail, isEmpty, validateSignup, validateLogin, getProfileDetails }

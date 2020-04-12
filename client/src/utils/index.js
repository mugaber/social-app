import Axios from 'axios'

const setAuthToken = (token) => {
  if (token) {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete Axios.defaults.headers.common['Authorization']
  }
}

const getLocalPosts = async () => {
  const localPosts = localStorage.getItem('social-posts')

  try {
    if (localPosts) return JSON.parse(localPosts)
  } catch (err) {
    console.log('error getting posts from localStorage', err)
  }

  try {
    const res = await Axios.get('/posts')
    const posts = res.data
    if (posts && posts.length) {
      localStorage.setItem('social-posts', JSON.stringify(posts))
      return posts
    }
  } catch (err) {
    console.log('error getting posts from API')
  }

  return undefined
}

export { setAuthToken, getLocalPosts }

import React, { useState, useEffect } from 'react'
import Axios from 'axios'

import Post from '../../components/Post'
import { HomePageContainer } from './styles'

import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)

      let localPosts

      try {
        localPosts = JSON.parse(localStorage.getItem('social-posts'))
      } catch (error) {}

      if (localPosts && localPosts.length) {
        setLoading(false)
        return setPosts(localPosts)
      }

      try {
        const fetchedPosts = await (await Axios.get('/posts')).data
        setPosts(fetchedPosts)
        localStorage.setItem('social-posts', JSON.stringify(fetchedPosts))
      } catch (error) {
        console.log(error)
        // TODO: notify user
      }

      setLoading(false)
    }

    fetchPosts()
  }, [])

  return (
    <HomePageContainer>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid item xs={12} sm={8} md={6} lg={5}>
          {posts.map((post) => (
            <Post key={post.postId} post={post} />
          ))}
        </Grid>
      )}
    </HomePageContainer>
  )
}

export default HomePage

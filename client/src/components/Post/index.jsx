import React, { useState } from 'react'

import { PostCard } from './styles'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'

import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import InsertCommentIcon from '@material-ui/icons/InsertComment'

//

const Post = ({ post }) => {
  const [expanded, setExpanded] = useState(false)
  const [commentText, setCommentText] = useState('')

  const {
    userImage,
    userHandle,
    createdAt,
    body,
    likeCount,
    commentCount,
    comments,
  } = post

  const dateTime = new Date(createdAt).toString().split('GMT')[0].trim()

  const handleCommentChange = (e) => {
    setCommentText(e.target.value)
  }

  const [shiftOn, setShiftOn] = useState(false)

  const handleCommentSubmit = (e) => {
    if (e.key === 'Shift') return setShiftOn(true)
    if (shiftOn && e.key === 'Enter') return setShiftOn(false)
    if (e.key !== 'Enter') return

    alert(commentText)
    setCommentText('')
  }

  return (
    <PostCard>
      <CardHeader
        className='main-card-header'
        title={userHandle}
        subheader={dateTime}
        avatar={
          <Avatar
            src={userImage}
            alt='user-image'
            style={{ width: '50px', height: '50px' }}
          />
        }
      />

      <Divider variant='middle' />

      <CardContent>
        <Typography variant='body1'>{body}</Typography>
      </CardContent>

      <CardActions className='feed-back'>
        <div>
          <ThumbUpAltIcon />
          {likeCount}
        </div>

        <div>
          <InsertCommentIcon
            onClick={() => {
              setExpanded(!expanded)
            }}
          />
          {commentCount}
        </div>
      </CardActions>

      {expanded && <Divider variant='middle' />}

      <Collapse in={expanded} unmountOnExit timeout='auto'>
        {comments ? (
          comments.map((comment) => (
            <CardHeader
              key={comment.createdAt}
              className='comment-card'
              title={comment.userHandle}
              subheader={comment.body}
              avatar={
                <Avatar
                  src={comment.userImage}
                  alt='comment-user-image'
                  style={{ width: '30px', height: '30px' }}
                />
              }
            />
          ))
        ) : (
          <div style={{ margin: '0 auto' }}>No comments yet.</div>
        )}
      </Collapse>

      <Divider variant='middle' />

      <CardContent className='comment-area'>
        <Avatar src={userImage} alt='user-image' />

        <Grid item xs={12}>
          <TextField
            multiline
            variant='outlined'
            rowsMax='10'
            id='comment-field'
            value={commentText}
            onChange={handleCommentChange}
            onKeyDown={handleCommentSubmit}
            placeholder='Write a comment'
          />
        </Grid>
      </CardContent>
    </PostCard>
  )
}

export default Post

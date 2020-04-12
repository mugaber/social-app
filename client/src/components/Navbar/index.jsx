import React, { useState } from 'react'
import { StyledToolbar, StyledDiv, NavbarButton } from './styles'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar'
import AppBar from '@material-ui/core/AppBar'

import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

import dummyData from '../../data'

const {
  user: { imageUrl, handle },
} = dummyData

// ?? the position of the Menu has to be fixed

const Navbar = ({ isAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClose = () => setAnchorEl(null)
  const handleClick = (e) => setAnchorEl(e.currentTarget)

  return (
    <AppBar position='static'>
      <StyledToolbar className='navbar-toolbar'>
        <NavbarButton variant='contained' component={Link} to='/'>
          Home
        </NavbarButton>

        <StyledDiv>
          {isAuthenticated ? (
            <div className='nav-user-info'>
              <p>{handle}</p>

              <Avatar
                src={imageUrl}
                alt='user-image'
                onClick={handleClick}
                aria-haspopup='true'
                aria-controls='user-info-menu'
              />

              <Menu
                id='user-info-menu'
                anchorE={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <AccountCircleIcon />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ExitToAppIcon />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <NavbarButton variant='contained' component={Link} to='/login'>
                Login
              </NavbarButton>

              <NavbarButton variant='contained' component={Link} to='/signup'>
                Signup
              </NavbarButton>
            </>
          )}
        </StyledDiv>
      </StyledToolbar>
    </AppBar>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(Navbar)

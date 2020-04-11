import React from 'react'
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import { StyledToolbar, StyledDiv, NavbarButton } from './styles'

//

const Navbar = () => {
  return (
    <AppBar position='static'>
      <StyledToolbar className='navbar-toolbar'>
        <NavbarButton variant='contained' component={Link} to='/'>
          Home
        </NavbarButton>

        <StyledDiv>
          <NavbarButton variant='contained' component={Link} to='/login'>
            Login
          </NavbarButton>

          <NavbarButton variant='contained' component={Link} to='/signup'>
            Signup
          </NavbarButton>
        </StyledDiv>
      </StyledToolbar>
    </AppBar>
  )
}

export default Navbar

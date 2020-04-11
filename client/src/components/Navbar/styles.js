import styled, { css } from 'styled-components'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

const ButtonStyles = css`
  width: 5rem;
  border-radius: 10px;
  padding: 0.7rem 1.4rem;
  transition: all 0.1s ease-in;

  &:active {
    transform: translateY(3px);
  }
`

const StyledToolbar = styled(Toolbar)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
`

const StyledDiv = styled.div`
  a {
    margin: 0.3rem;
  }
`

const NavbarButton = styled(Button)`
  ${ButtonStyles}
`

export { StyledToolbar, StyledDiv, NavbarButton }

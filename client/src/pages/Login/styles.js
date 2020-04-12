import styled from 'styled-components'

const LoginContainer = styled.div`
  min-height: 90vh;
  background-color: rgb(241, 241, 241);

  h1 {
    padding: 5rem 0 2rem;
    text-align: center;
  }

  .MuiGrid-root {
    margin: auto;
  }

  .MuiFormControl-root {
    margin-bottom: 2rem;
    background-color: white;
  }

  .MuiButton-root {
    width: 30%;
    display: block;
    margin: 0.5rem auto;
    transition: all 0.2s ease-in-out;

    &:active {
      transform: translateY(2px);
    }
  }

  .sign-up-link {
    margin-top: 2rem;

    a {
      margin-left: 0.8rem;
      text-decoration: none;
    }
  }
`

export { LoginContainer }

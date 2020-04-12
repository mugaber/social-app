import styled from 'styled-components'
import { Grid } from '@material-ui/core'

const SignupGrid = styled(Grid)`
  min-height: 90vh;
  background-color: rgb(241, 241, 241);

  .form-grid {
    margin: 1rem auto;

    h2 {
      padding: 2rem 0;
    }

    .MuiFormControl-root {
      margin: 0.6rem auto;
      background-color: white;
    }

    button {
      margin: 1rem auto;
    }
  }
`

export default SignupGrid

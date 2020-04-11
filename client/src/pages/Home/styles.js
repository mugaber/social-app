import styled from 'styled-components'

const HomePageContainer = styled.div`
  min-height: 90vh;
  background-color: rgb(241, 241, 241);
  padding: 2rem 0 1rem;

  .MuiGrid-root {
    margin: auto;
  }

  .MuiCircularProgress-root {
    top: 50vh;
    left: 50vw;
    position: absolute;
    color: #0066ff;
  }
`

export { HomePageContainer }

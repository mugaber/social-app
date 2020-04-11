import styled from 'styled-components'
import Card from '@material-ui/core/Card'

const PostCard = styled(Card)`
  border-radius: 10px;
  margin-bottom: 0.7rem;

  .main-card-header {
    .MuiCardHeader-title {
      font-size: 110%;
      font-weight: bold;
    }
  }

  .feed-back {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    padding: 1rem;

    svg {
      top: 2px;
      height: 1rem;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease-in-out;

      &:hover {
        color: #0066ff;
        transform: scale(1.3);
      }

      &:active {
        transform: scale(1);
      }
    }
  }

  .MuiCollapse-container {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .comment-card {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }

  .comment-area {
    padding: 0.7rem 1rem;
    display: flex;
    flex-direction: row;

    img {
      width: 35px;
      height: 35px;
      border-radius: 50px;
    }

    .MuiFormControl-root {
      font-size: 16;

      width: 99%;
      margin-left: 0.5rem;

      border-radius: 10px;
      border: 1px solid #ced4da;
    }

    .MuiInputBase-root {
      padding: 0.5rem;
    }
  }
`

export { PostCard }

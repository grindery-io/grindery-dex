import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 20px 0 0;

  & .MuiAlert-root {
    padding: 20px;
    border-radius: 5px;
  }

  & .MuiAlert-message {
    padding: 0;
  }

  & .MuiAlert-icon {
    padding: 0;

    & svg {
      margin-top: 0px;
    }
  }

  & .MuiAlert-message p {
    text-align: left;
    padding: 0;
    margin: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: #0b0d17;

    & a {
      color: #170b10;
      text-decoration: underline;

      &:hover {
        color: #170b10;
        text-decoration: none;
      }
    }
  }
`;

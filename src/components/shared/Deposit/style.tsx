import styled from "styled-components";
import {SCREEN} from "../../../constants";

export const ButtonWrapper = styled.div`
  margin: 32px 0 0;
  text-align: right;
`;

export const Title = styled.p`
  font-weight: 700;
  font-size: 25px;
  line-height: 120%;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  padding: 0 50px;
  margin: 0 0 15px;
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0;
    max-width: 576px;
    margin: 0 auto 15px;
  }
`;

export const Text = styled.div`
  & p,
  & li {
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    color: #363636;
  }

  & p {
    margin: 0 0 24px;
    padding: 0;
  }

  & ul {
    margin: 0 0 24px;
    padding: 0 0 0 20px;

    & li {
      margin: 0;
      padding: 0 0 0 0;
      list-style-type: disc;
    }
  }
`;

import styled from 'styled-components';
import { SCREEN } from '../../config';

export const ButtonWrapper = styled.div`
  margin: 10px 0 0;
  text-align: right;

  & button {
    background-color: #3f49e1;
    font-weight: 400;
    border-radius: 8px;

    &:hover {
      background-color: rgb(50, 58, 180);
      opacity: 1;
      box-shadow: none;
    }
  }
`;

export const Title = styled.p`
  font-weight: 700;
  font-size: 24px;
  line-height: 150%;
  text-align: left;
  color: rgba(0, 0, 0, 0.87);
  padding: 0 50px;
  margin: 0 0 15px;
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0;
    max-width: 576px;
    margin: 0 auto 15px;
  }
`;

export const NumberInput = styled.div`
  & .MuiInputAdornment-positionStart {
    display: none !important;
  }
`;

export const TextBadge = styled.p`
  background-color: rgb(245, 181, 255);
  border: 1px solid rgb(245, 181, 255);
  border-radius: 8px;
  color: rgb(0, 0, 0);
  padding: 6px;
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
  height: auto;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  display: inline-block;
  margin: 12px 0px 0 16px;

  &.secondary {
    background-color: transparent;
    border: 1px solid rgb(224, 224, 224);
    color: rgb(116, 116, 116);
  }
`;

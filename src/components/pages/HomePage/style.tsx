import {SCREEN} from "../../../constants";
import styled from "styled-components";

export const Container = styled.div`
  padding: 120px 20px 0px;
`;

export const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RootWrapper2 = styled.div`
  max-width: calc(75vw - 30px);
  width: 50rem;
  border: 1px solid #dcdcdc;
  max-width: auto;
`;

export const TabsWrapper = styled.div`
  & .MuiTab-root {
    text-transform: initial;
    font-weight: 400;
    font-size: var(--text-size-horizontal-tab-label);
    line-height: 150%;

    @media (min-width: ${SCREEN.TABLET}) {
      min-width: 150px;
    }
  }
`;

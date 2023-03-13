import styled from 'styled-components';

const DexOfferBadge = styled.p`
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

export default DexOfferBadge;

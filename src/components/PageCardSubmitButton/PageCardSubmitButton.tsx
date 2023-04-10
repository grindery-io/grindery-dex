import React from 'react';
import styled from 'styled-components';
import { Button } from 'grindery-ui';

export const ButtonWrapper = styled.div`
  margin: 10px 0 0;
  text-align: right;
  padding: 0 0 10px;

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

type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const PageCardSubmitButton = (props: Props) => {
  const { label, onClick, disabled, loading } = props;
  return (
    <ButtonWrapper>
      <Button
        loading={loading}
        disabled={disabled}
        fullWidth
        value={label}
        onClick={onClick}
      />
    </ButtonWrapper>
  );
};

export default PageCardSubmitButton;

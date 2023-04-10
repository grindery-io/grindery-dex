import React from 'react';
import styled from 'styled-components';
import { LoadingButton } from '@mui/lab';
import Loading from '../Loading/Loading';

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
      <LoadingButton
        loading={loading}
        disabled={disabled}
        fullWidth
        onClick={onClick}
        startIcon={
          loading ? (
            <Loading
              style={{ margin: '0 10px 0 0', color: '#fff' }}
              size={16}
            />
          ) : undefined
        }
      >
        {label}
      </LoadingButton>
    </ButtonWrapper>
  );
};

export default PageCardSubmitButton;

import React from 'react';
import { LoadingButton } from '@mui/lab';
import Loading from '../Loading/Loading';
import { ButtonWrapper } from './PageCardSubmitButton.style';

type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  disableRipple?: boolean;
};

const PageCardSubmitButton = (props: Props) => {
  const { label, onClick, disabled, loading, className, disableRipple } = props;
  return (
    <ButtonWrapper>
      <LoadingButton
        disableRipple={disableRipple}
        className={className}
        disabled={disabled}
        fullWidth
        onClick={onClick}
        startIcon={
          loading ? (
            <Loading style={{ margin: '0', color: 'inherit' }} size={16} />
          ) : undefined
        }
      >
        {label}
      </LoadingButton>
    </ButtonWrapper>
  );
};

export default PageCardSubmitButton;

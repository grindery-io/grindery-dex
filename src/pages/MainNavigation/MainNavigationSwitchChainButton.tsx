import React from 'react';
import { Box, Button } from '@mui/material';
import {
  selectChainsItems,
  selectChainsLoading,
  selectUserChainId,
  selectUserId,
  useAppSelector,
} from '../../store';
import { getChainById, switchMetamaskNetwork } from '../../utils';
import { ChainType } from '../../types';

type Props = {};

const MainNavigationSwitchChainButton = (props: Props) => {
  const chains = useAppSelector(selectChainsItems);
  const chainsLoading = useAppSelector(selectChainsLoading);
  const userChainId = useAppSelector(selectUserChainId);
  const userId = useAppSelector(selectUserId);
  const goerliChain = getChainById('5', chains);

  const handleButtonClick = async (userChainId: string, chain: ChainType) => {
    try {
      await switchMetamaskNetwork(userChainId, chain);
    } catch (error) {
      // handle error
    }
  };

  return userId &&
    !chainsLoading &&
    chains &&
    chains.length > 0 &&
    userChainId &&
    userChainId !== '5' &&
    goerliChain ? (
    <Box
      className="MainNavigationSwitchChainButton"
      sx={{
        '& .MuiButton-root': {
          margin: 0,
        },
        '& .MuiTouchRipple-root': {
          marginRight: 0,
        },
        '& button': {
          backgroundColor: '#3f49e1',
          fontWeight: 400,
          borderRadius: '24px',
          fontSize: '14px',
          '&:hover': {
            backgroundColor: 'rgb(50, 58, 180)',
            opacity: 1,
            boxShadow: 'none',
          },
        },
      }}
    >
      <Button
        color="secondary"
        onClick={() => {
          handleButtonClick(userChainId, goerliChain);
        }}
      >
        Switch to Goerli
      </Button>
    </Box>
  ) : null;
};

export default MainNavigationSwitchChainButton;

import React from 'react';
import { Box, Button } from '@mui/material';
import {
  selectChainsStore,
  selectUserStore,
  useAppSelector,
} from '../../store';
import { getChainById, switchMetamaskNetwork } from '../../utils';
import { ChainType } from '../../types';
import { RefreshIcon } from '../../icons';

type Props = {};

const MainNavigationSwitchChainButton = (props: Props) => {
  const { items: chains, loading: chainsLoading } =
    useAppSelector(selectChainsStore);
  const { id: userId, chainId: userChainId } = useAppSelector(selectUserStore);
  const goerliChain = getChainById('5', chains);

  const handleButtonClick = async (userChainId: string, chain: ChainType) => {
    try {
      await switchMetamaskNetwork(userChainId, chain);
    } catch (error) {
      console.error('switchMetamaskNetwork error: ', error);
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
          backgroundColor: 'transparent',
          border: '1px solid #0B0D17',
          borderRadius: '5px',
          padding: '11px 16px',
          fontWeight: '700',
          fontSize: '16px',
          lineHeight: '150%',
          color: '#0B0D17',
          '&:hover': {
            backgroundColor: '#F4F5F7',
            border: '1px solid #0B0D17',
            opacity: 1,
            boxShadow: '0px 4px 8px rgba(106, 71, 147, 0.1)',
          },
          '& .MuiButton-startIcon': {
            marginLeft: '0px',
            '& svg': {
              width: '16px',
              height: '16px',
            },
          },
        },
      }}
    >
      <Button
        startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
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

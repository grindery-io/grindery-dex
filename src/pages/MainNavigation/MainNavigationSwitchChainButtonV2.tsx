import React from 'react';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import {
  selectChainsStore,
  selectUserStore,
  useAppSelector,
} from '../../store';
import {
  filterBuyerChains,
  getChainById,
  switchMetamaskNetwork,
} from '../../utils';
import { ChainType } from '../../types';
import { RefreshIcon } from '../../icons';
import { Menu } from '../../components';

type Props = {};

const MainNavigationSwitchChainButtonV2 = (props: Props) => {
  const { items: chains, loading: chainsLoading } =
    useAppSelector(selectChainsStore);
  const { id: userId, chainId: userChainId } = useAppSelector(selectUserStore);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const selectedChain = getChainById(userChainId, chains);
  const chainsList = filterBuyerChains(chains);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (
    event: React.MouseEvent<HTMLElement>,
    chain: ChainType,
    userChainId: string
  ) => {
    setAnchorEl(null);
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
    !selectedChain ? (
    <Box
      className="MainNavigationSwitchChainButtonV2"
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
        onClick={handleButtonClick}
      >
        Switch Network
      </Button>
      <Menu
        id="blockchain-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {chainsList.map((chain: ChainType) => (
          <MenuItem
            key={chain.chainId}
            onClick={(event) => {
              if (chain.chainId !== userChainId) {
                handleMenuItemClick(event, chain, userChainId);
              } else {
                handleClose();
              }
            }}
            id={`chain-${chain.chainId}`}
          >
            <ListItemIcon>
              <img src={chain.icon} alt="" />
            </ListItemIcon>
            <Typography component="span" variant="body2">
              {chain.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  ) : null;
};

export default MainNavigationSwitchChainButtonV2;

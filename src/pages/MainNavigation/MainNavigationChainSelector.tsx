import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  selectChainsStore,
  selectUserStore,
  useAppSelector,
} from '../../store';
import { getChainById, switchMetamaskNetwork } from '../../utils';
import { ChainType } from '../../types';
import { Menu } from '../../components';

type Props = {};

const MainNavigationChainSelector = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { items: chains, loading: chainsLoading } =
    useAppSelector(selectChainsStore);
  const {
    id: userId,
    chainId: userChainId,
    chainTokenBalance: userChainTokenBalance,
    chainTokenBalanceLoading: userChainTokenBalanceLoading,
    chainTokenPrice: userChainTokenPrice,
    chainTokenPriceLoading: userChainTokenPriceLoading,
  } = useAppSelector(selectUserStore);
  const selectedChain = getChainById(userChainId, chains);
  const chainsList = chains.filter((chain: ChainType) => chain.chainId === '5');
  const handleClickListItemButton = (event: React.MouseEvent<HTMLElement>) => {
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

  return userId && !chainsLoading && chains && chains.length > 0 ? (
    <Box className="MainNavigationChainSelector">
      <List
        component="nav"
        aria-label="Blockchain"
        sx={{
          bgcolor: 'transparent',
          padding: '0',
          '& .MuiListItemSecondaryAction-root': {
            height: '20px',
            width: '20px',
            right: '8px',
          },
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="when device is locked"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItemButton}
            sx={{
              borderRadius: '34px',
              paddingTop: '3px',
              paddingBottom: '3px',
              paddingLeft: selectedChain ? '8px' : '12px',
              paddingRight: '12px',
              transition: 'border-color 0.2s ease-in-out',
              border: `1px solid ${open ? '#0b0d17' : '#dcdcdc'}`,
              '&:hover': {
                background: 'transparent',
                borderColor: '#0b0d17 !important',
              },
            }}
          >
            {selectedChain && (
              <ListItemIcon
                sx={{
                  minWidth: '36px',
                  '& img': {
                    width: '28px',
                    height: '28px',
                    maxWidth: '28px',
                    display: 'block',
                  },
                }}
              >
                <img src={selectedChain?.icon} alt="" />
              </ListItemIcon>
            )}

            <ListItemText
              sx={{
                margin: 0,
                '& .MuiListItemText-secondary': {
                  lineHeight: 1,
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                },
              }}
              primary={
                <Typography variant="body2">
                  {selectedChain ? selectedChain.label : 'Select blockchain'}
                </Typography>
              }
              secondary={
                selectedChain && (
                  <>
                    {userChainTokenBalance &&
                    userChainTokenPrice &&
                    !userChainTokenPriceLoading &&
                    !userChainTokenBalanceLoading ? (
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ lineHeight: 1 }}
                      >
                        {parseFloat(
                          parseFloat(userChainTokenBalance).toFixed(6)
                        ).toString()}{' '}
                        / U${' '}
                        {parseFloat(
                          (
                            parseFloat(userChainTokenBalance) *
                            userChainTokenPrice
                          ).toFixed(2)
                        ).toString()}
                      </Typography>
                    ) : (
                      <Skeleton width="100px" />
                    )}
                  </>
                )
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Menu
        id="blockchain-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <Typography component="span" variant="body2">
            Select blockchain
          </Typography>
        </MenuItem>
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

export default MainNavigationChainSelector;

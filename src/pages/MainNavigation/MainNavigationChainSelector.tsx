import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  selectChainsItems,
  selectChainsLoading,
  selectUserChainId,
  selectUserChainTokenBalance,
  selectUserChainTokenBalanceLoading,
  selectUserChainTokenPrice,
  selectUserChainTokenPriceLoading,
  selectUserId,
  useAppSelector,
} from '../../store';
import { getChainById, switchMetamaskNetwork } from '../../utils';
import { ChainType } from '../../types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {};

const MainNavigationChainSelector = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const chains = useAppSelector(selectChainsItems);
  const chainsLoading = useAppSelector(selectChainsLoading);
  const userChainId = useAppSelector(selectUserChainId);
  const userId = useAppSelector(selectUserId);
  const selectedChain = getChainById(userChainId, chains);
  const chainsList = chains.filter((chain: ChainType) => chain.chainId === '5');
  const userChainTokenBalance = useAppSelector(selectUserChainTokenBalance);
  const userChainTokenBalanceLoading = useAppSelector(
    selectUserChainTokenBalanceLoading
  );
  const userChainTokenPrice = useAppSelector(selectUserChainTokenPrice);
  const userChainTokenPriceLoading = useAppSelector(
    selectUserChainTokenPriceLoading
  );

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
      // handle error
    }
  };

  return userId && !chainsLoading && chains && chains.length > 0 ? (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap="6px"
      flexWrap="nowrap"
      className="MainNavigationChainSelector"
    >
      <List
        component="nav"
        aria-label="Blockchain"
        sx={{
          bgcolor: 'background.paper',
          padding: '0',
          '& .MuiListItemSecondaryAction-root': {
            height: '20px',
            width: '20px',
            right: '8px',
          },
        }}
      >
        <ListItem
          disablePadding
          secondaryAction={
            <ExpandMoreIcon
              sx={{
                width: '20px',
                height: '20px',
                transform: `scaleY(${open ? '-1' : '1'})`,
              }}
            />
          }
        >
          <ListItemButton
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="when device is locked"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItemButton}
            sx={{
              borderRadius: '34px',
              paddingTop: '4px',
              paddingBottom: '4px',
              paddingLeft: selectedChain ? '8px' : '12px',
              paddingRight: '32px !important',
            }}
          >
            {selectedChain && (
              <ListItemIcon
                sx={{
                  minWidth: '28px',
                  '& img': {
                    width: '20px',
                    height: '20px',
                    maxWidth: '20px',
                    display: 'block',
                  },
                }}
              >
                <img src={selectedChain?.icon} alt="" />
              </ListItemIcon>
            )}

            <ListItemText
              primary={
                selectedChain ? selectedChain.label : 'Select blockchain'
              }
              //secondary={options[selectedIndex]}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Menu
        id="blockchain-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: '#ffffff',
            border: '1px solid #dcdcdc',
            boxShadow: '2px 2px 24px rgba(0, 0, 0, 0.15)',
            borderRadius: '10px',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
          sx: {
            padding: '10px',
            '& .MuiButtonBase-root': {
              borderRadius: '5px',
              '&:hover': {
                background: '#fdfbff',
              },
            },
          },
        }}
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
            sx={{
              padding: '8px',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '32px !important',
                '& img': {
                  width: '20px',
                  height: '20px',
                  maxWidth: '20px',
                  display: 'block',
                },
              }}
            >
              <img src={chain.icon} alt="" />
            </ListItemIcon>
            <Typography component="span" variant="body2">
              {chain.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      {selectedChain &&
      userChainTokenBalance &&
      userChainTokenPrice &&
      !userChainTokenPriceLoading &&
      !userChainTokenBalanceLoading ? (
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Typography variant="body2">
            {parseFloat(
              parseFloat(userChainTokenBalance).toFixed(6)
            ).toString()}{' '}
            / U${' '}
            {parseFloat(
              (parseFloat(userChainTokenBalance) * userChainTokenPrice).toFixed(
                2
              )
            ).toString()}
          </Typography>
        </Box>
      ) : (
        <Skeleton width="100px" />
      )}
    </Stack>
  ) : null;
};

export default MainNavigationChainSelector;

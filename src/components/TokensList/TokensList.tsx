import React from 'react';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from '@mui/material';
import { TokenType } from '../../types';

type Props = {
  tokens: any[];
  onClick: (token: TokenType) => void;
  loading?: boolean;
  chainLabel?: string;
};

const TokensList = (props: Props) => {
  const { tokens, onClick, loading, chainLabel } = props;
  return (
    <Box style={{ height: '350px', overflow: 'auto' }} mt={2} pb="16px">
      <List disablePadding>
        {loading ? (
          <>
            {[0, 1, 2].map((i: number) => (
              <Skeleton
                key={i}
                height="65px"
                sx={{
                  transform: 'initial',
                  borderRadius: '12px',
                  marginBottom: '10px',
                }}
              />
            ))}
          </>
        ) : (
          <>
            {tokens.map((token: any) => (
              <ListItem
                key={token._id}
                disablePadding
                style={{
                  height: `64px`,
                }}
              >
                <ListItemButton
                  onClick={() => {
                    onClick(token);
                  }}
                  dense
                  style={{ borderRadius: '12px' }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      src={token.icon}
                      alt={token.symbol}
                    >
                      {token.symbol}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span style={{ fontWeight: '500', fontSize: '18px' }}>
                        {token.symbol}
                      </span>
                    }
                    secondary={chainLabel || ''}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );
};

export default TokensList;

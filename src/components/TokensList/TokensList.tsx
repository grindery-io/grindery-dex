import React from 'react';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

type Props = {
  tokens: any[];
  onClick: (token: any) => void;
};

const TokensList = (props: Props) => {
  const { tokens, onClick } = props;
  return (
    <Box style={{ height: '350px', overflow: 'auto' }} mt={2} pb="16px">
      <List disablePadding>
        {tokens.map((token: any) => (
          <ListItem
            key={token.id}
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
                secondary={token.symbol}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TokensList;

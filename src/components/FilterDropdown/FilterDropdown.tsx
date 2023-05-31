import React, { useState } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Menu } from '../Menu/Menu';
import CheckIcon from '@mui/icons-material/Check';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  defaultOption?: { value: string; label: string };
};

const FilterDropdown = (props: Props) => {
  const { label, value, onChange, options, defaultOption } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const selectedLabel = `${label} ${
    options.find((option) => option.value === value)?.label || ''
  }`;

  const handleClickListItemButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ListItem disablePadding sx={{ width: 'auto' }}>
        <ListItemButton
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItemButton}
          component="button"
          disableRipple
          sx={{
            '&:hover': {
              background: 'none',
            },
            '& .MuiTypography-body2, & .MuiListItemIcon-root': {
              opacity: '0.5',
            },
            '&:hover .MuiTypography-body2, &:hover .MuiListItemIcon-root': {
              opacity: '1',
            },
          }}
        >
          <ListItemText
            secondaryTypographyProps={{
              component: 'div',
            }}
            sx={{
              margin: 0,
            }}
            primary={
              <Typography
                variant="body2"
                sx={{
                  color: '#0B0D17',
                }}
              >
                {selectedLabel}
              </Typography>
            }
          />
          <ListItemIcon sx={{ minWidth: 'initial', marginLeft: '4px' }}>
            <ArrowDropDownIcon />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiListItemIcon-root': {
            minWidth: '24px !important',
          },
        }}
      >
        {defaultOption && (
          <MenuItem
            onClick={() => {
              onChange(defaultOption.value);
              handleClose();
            }}
          >
            <ListItemIcon>
              <CheckIcon
                sx={{ fontSize: '16px', opacity: value === '' ? 1 : 0 }}
              />
            </ListItemIcon>

            <Typography component="span" variant="body2">
              {defaultOption.label}
            </Typography>
          </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              onChange(option.value);
              handleClose();
            }}
          >
            <ListItemIcon>
              <CheckIcon
                sx={{
                  fontSize: '16px',
                  opacity: value === option.value ? 1 : 0,
                }}
              />
            </ListItemIcon>
            <Typography component="span" variant="body2">
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FilterDropdown;

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  borderRadius: '24px',
  '& .MuiTabs-flexContainer': {
    position: 'relative',
    zIndex: '2',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '42.5px',
    bottom: '5px',
    zIndex: '1',
  },
  '& .MuiTabs-indicatorSpan': {
    borderRadius: '24px',
    width: '100%',
    backgroundColor: '#fff',
  },
});

export const StyledTab = styled((props: TabProps) => <Tab {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontSize: '18px',
    marginRight: '6px',
    marginLeft: '6px',
    color: '#000',
    borderRadius: '28px',
    minHeight: 'initial',
    marginTop: '4px',
    marginBottom: '5px',
    padding: '10px 42px',
    fontWeight: '500',
    '&.Mui-selected': {
      color: '#000',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
    '& .MuiTab-iconWrapper': {
      width: '20px',
      height: '20px',
      color: 'inherit',
    },
  })
);

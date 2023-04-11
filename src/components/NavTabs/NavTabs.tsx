import React from 'react';
import { StyledTab, StyledTabs } from './NavTabs.style';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavTabsItemType } from '../../types';

type Props = {
  menu: NavTabsItemType[];
};

const NavTabs = (props: Props) => {
  const { menu } = props;
  let location = useLocation();
  let navigate = useNavigate();
  const value = menu.findIndex((item: NavTabsItemType) =>
    location.pathname.includes(item.path)
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(menu[newValue].path);
  };
  return (
    // Ignore Material Tabs error for `false` value.
    // @ts-ignore
    <StyledTabs value={value >= 0 ? value : false} onChange={handleChange}>
      {menu.map((item: NavTabsItemType) => (
        <StyledTab
          key={item.path}
          icon={item.icon}
          iconPosition={item.iconPosition}
          label={item.label}
        />
      ))}
    </StyledTabs>
  );
};

export default NavTabs;

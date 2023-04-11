import { SidebarNavigationItemType } from '../types';
import { ROUTES } from './routes';

export const DRAWER_NAVIGATION: SidebarNavigationItemType[] = [
  {
    path: ROUTES.BUY.FULL_PATH,
    label: 'Buy',
  },
  {
    path: ROUTES.SELL.FULL_PATH,
    label: 'Sell',
  },
];

export const BUY_NAVIGATION: SidebarNavigationItemType[] = [
  {
    path: ROUTES.BUY.TRADE.ROOT.FULL_PATH,
    label: 'Trade',
  },
  {
    path: ROUTES.BUY.SHOP.ROOT.FULL_PATH,
    label: 'Shop',
  },
];

export const SELL_NAVIGATION: SidebarNavigationItemType[] = [
  {
    path: ROUTES.SELL.OFFERS.ROOT.FULL_PATH,
    label: 'Offers',
  },
  {
    path: ROUTES.SELL.ORDERS.ROOT.FULL_PATH,
    label: 'Orders',
  },
  {
    path: ROUTES.SELL.AUTOMATIONS.ROOT.FULL_PATH,
    label: 'Trading Automation',
  },
];

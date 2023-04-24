import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainNavigation from '../MainNavigation/MainNavigation';
import { DISABLE_POPUP, ROUTES } from '../../config';
import BuyPage from '../BuyPage/BuyPage';
import SellPage from '../SellPage/SellPage';
import HistoryPage from '../HistoryPage/HistoryPage';
import FaucetPage from '../FaucetPage/FaucetPage';
import Page404 from '../Page404/Page404';
import { PageContainer, Popup, SessionExpiredPopup } from '../../components';
import {
  selectUserAdvancedMode,
  selectUserAdvancedModeAlert,
  selectUserPopupClosed,
  selectUserSessionExpired,
  useAppSelector,
} from '../../store';
import { useUserController } from '../../controllers';

type Props = {};

const AppRouter = (props: Props) => {
  const sessionExpired = useAppSelector(selectUserSessionExpired);
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const advancedModeAlert = useAppSelector(selectUserAdvancedModeAlert);
  const popupClosed = useAppSelector(selectUserPopupClosed);
  const { handlePopupCloseAction } = useUserController();

  return (
    <>
      <PageContainer
        topShift={advancedMode && advancedModeAlert ? '123px' : '75px'}
      >
        <BrowserRouter>
          <MainNavigation />
          <Routes>
            <Route path={ROUTES.BUY.RELATIVE_PATH} element={<BuyPage />} />
            <Route path={ROUTES.SELL.RELATIVE_PATH} element={<SellPage />} />
            <Route
              path={ROUTES.HISTORY.RELATIVE_PATH}
              element={<HistoryPage />}
            />
            <Route
              path={ROUTES.FAUCET.RELATIVE_PATH}
              element={<FaucetPage />}
            />
            <Route path="/" element={<Navigate to={ROUTES.BUY.FULL_PATH} />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </BrowserRouter>
      </PageContainer>
      {DISABLE_POPUP !== 'true' && !popupClosed && (
        <Popup onClose={handlePopupCloseAction} />
      )}
      {sessionExpired && <SessionExpiredPopup />}
    </>
  );
};

export default AppRouter;

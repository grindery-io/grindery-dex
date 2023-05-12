import React, {
  createContext,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { checkBrowser, requestPermission } from '../utils/firebase';
import {
  notificationsStoreActions,
  selectNotificationsStore,
  selectUserStore,
  useAppDispatch,
  useAppSelector,
} from '../store';
import { saveNotificationsTokenRequest } from '../services';

// Context props
type ContextProps = {
  dismissNotificationsAction: () => void;
  requestNotificationsPermissionAction: () => void;
};

// Context provider props
type NotificationsProviderProps = {
  children: React.ReactNode;
};

// Init context
export const NotificationsContext = createContext<ContextProps>({
  dismissNotificationsAction: () => {},
  requestNotificationsPermissionAction: () => {},
});

export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  const dispatch = useAppDispatch();
  const { id: userId, accessToken } = useAppSelector(selectUserStore);
  const { token } = useAppSelector(selectNotificationsStore);

  const requestNotificationsPermissionAction = useCallback(() => {
    requestPermission(
      (notificationsToken: string) => {
        dispatch(notificationsStoreActions.setToken(notificationsToken));
      },
      (browserIsSupported: boolean) => {
        dispatch(notificationsStoreActions.setIsSupported(browserIsSupported));
      }
    );
  }, [dispatch]);

  const dismissNotificationsAction = useCallback(async () => {
    localStorage.setItem(`gr_mercari_notifications_canceled_${userId}`, 'yes');
    dispatch(notificationsStoreActions.setIsCanceled(true));
  }, [userId, dispatch]);

  const saveUserToken = useCallback(
    async (token: string) => {
      try {
        await saveNotificationsTokenRequest(accessToken, token);
        localStorage.setItem(`gr_mercari_notifications_${userId}`, 'yes');
      } catch (error: any) {
        console.error('saveUserToken error: ', error);
      }
    },
    [accessToken, userId]
  );

  useEffect(() => {
    checkBrowser((browserIsSupported: boolean) => {
      dispatch(notificationsStoreActions.setIsSupported(browserIsSupported));
    });
  }, [dispatch]);

  useEffect(() => {
    if (accessToken && token) {
      saveUserToken(token);
    }
  }, [accessToken, token, saveUserToken]);

  useEffect(() => {
    if (userId) {
      dispatch(
        notificationsStoreActions.setIsCanceled(
          Boolean(
            localStorage.getItem(`gr_mercari_notifications_canceled_${userId}`)
          )
        )
      );
      dispatch(
        notificationsStoreActions.setIsSubscribed(
          Boolean(localStorage.getItem(`gr_mercari_notifications_${userId}`))
        )
      );
    }
  }, [userId, dispatch]);

  return (
    <NotificationsContext.Provider
      value={{
        dismissNotificationsAction,
        requestNotificationsPermissionAction,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsProvider = () => useContext(NotificationsContext);

export default NotificationsProvider;

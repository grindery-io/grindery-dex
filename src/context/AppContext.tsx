import NexusClient from 'grindery-nexus-client';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { defaultFunc } from '../helpers/utils';

// Context props
type ContextProps = {
  user: string | null;
  disconnect: any;
  connect: any;
  accessAllowed: boolean;
  verifying: boolean;
  client: NexusClient | null;
  isOptedIn: boolean;
  chekingOptIn: boolean;
  userEmail: string;
  userProps: any;
  setIsOptedIn: (a: boolean) => void;
  setUserEmail: (a: string) => void;
  setUserProps: (a: any) => void;
};

// Context provider props
type AppContextProps = {
  children: React.ReactNode;
};

// Init context
export const AppContext = createContext<ContextProps>({
  user: null,
  disconnect: defaultFunc,
  connect: defaultFunc,
  accessAllowed: false,
  verifying: true,
  client: null,
  isOptedIn: false,
  chekingOptIn: true,
  userEmail: '',
  userProps: {},
  setIsOptedIn: () => {},
  setUserEmail: () => {},
  setUserProps: () => {},
});

export const AppContextProvider = ({ children }: AppContextProps) => {
  // Auth hook
  const { user, connect, disconnect, token: nexusToken } = useGrinderyNexus();

  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);

  const [isOptedIn, setIsOptedIn] = useState<boolean>(false);

  const [chekingOptIn, setChekingOptIn] = useState<boolean>(true);

  // verification state
  const [verifying, setVerifying] = useState<boolean>(true);

  // Nexus API client
  const [client, setClient] = useState<NexusClient | null>(null);

  const [userEmail, setUserEmail] = useState('');

  const [userProps, setUserProps] = useState<any>({});

  // Initialize user
  const initUser = useCallback(
    (userId: string | null, access_token: string) => {
      if (userId && access_token) {
        const nexus = new NexusClient();
        nexus.authenticate(access_token);
        setClient(nexus);
      }
    },
    []
  );

  const verifyUser = async () => {
    setVerifying(true);
    const res = await client?.isUserHasEmail().catch((err) => {
      console.error('isUserHasEmail error:', err.message);
      setAccessAllowed(false);
    });
    if (res) {
      const props = await client?.getUserProps().catch((err) => {
        console.error('getUserProps error:', err.message);
        setUserProps('');
      });
      setUserProps(props || {});
      setAccessAllowed(true);
      const optinRes = await client?.isAllowedUser().catch((err) => {
        console.error('isAllowedUser error:', err.message);
        setIsOptedIn(false);
      });
      if (optinRes) {
        setIsOptedIn(true);
      } else {
        setIsOptedIn(false);
      }
    } else {
      setAccessAllowed(false);
    }
    setChekingOptIn(false);
    setVerifying(false);
  };

  useEffect(() => {
    if (user && client) {
      verifyUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, client]);

  useEffect(() => {
    if (user) {
      initUser(user, nexusToken?.access_token || '');
    }
  }, [user, initUser, nexusToken]);

  return (
    <AppContext.Provider
      value={{
        user,
        disconnect,
        connect,
        accessAllowed,
        verifying,
        client,
        isOptedIn,
        chekingOptIn,
        userEmail,
        setIsOptedIn,
        setUserEmail,
        userProps,
        setUserProps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

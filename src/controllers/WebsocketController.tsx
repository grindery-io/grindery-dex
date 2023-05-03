import React, { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WEBSOCKET_URL } from '../config';
import {
  selectUserAccessToken,
  useAppDispatch,
  useAppSelector,
} from '../store';
import {
  setMessagesItem,
  setMessagesStatus,
} from '../store/slices/messagesSlice';

type WebsocketControllerProps = {
  children: React.ReactNode;
};

export const WebsocketController = ({ children }: WebsocketControllerProps) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    accessToken ? WEBSOCKET_URL || null : null,
    {
      onError: (event: WebSocketEventMap['error']) => {
        console.log('websocket error: ', event);
      },
      onClose: (event: WebSocketEventMap['close']) => {
        console.log('websocket connection closed: ', event);
      },
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    dispatch(setMessagesStatus(connectionStatus));
  }, [connectionStatus, dispatch]);

  useEffect(() => {
    if (lastMessage !== null) {
      let messageData: any;
      try {
        messageData = JSON.parse(lastMessage.data);
      } catch (error: any) {
        messageData = lastMessage.data;
      }
      dispatch(setMessagesItem(messageData));
    }
  }, [lastMessage, dispatch]);

  useEffect(() => {
    if (connectionStatus === 'Open' && accessToken) {
      sendMessage(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'authenticated',
          params: {
            access_token: accessToken,
          },
          id: new Date().toString(),
        })
      );
    }
  }, [connectionStatus, sendMessage, accessToken]);

  return <>{children}</>;
};

export default WebsocketController;

import React, { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WEBSOCKET_URL } from '../config';
import { useAppDispatch } from '../store';
import {
  setMessagesItem,
  setMessagesStatus,
} from '../store/slices/messagesSlice';

type WebscoketControllerProps = {
  children: React.ReactNode;
};

export const WebscoketController = ({ children }: WebscoketControllerProps) => {
  const dispatch = useAppDispatch();
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    WEBSOCKET_URL || null
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
    if (connectionStatus === 'Open') {
      sendMessage('Test');
    }
  }, [connectionStatus, sendMessage]);

  return <>{children}</>;
};

export default WebscoketController;

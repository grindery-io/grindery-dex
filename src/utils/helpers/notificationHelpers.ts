import { JSONRPCRequestType } from '../../types';
import { capitalizeFirstLetter } from '../string';

export const getNotificationText = (
  event: JSONRPCRequestType
): string | null => {
  if (event.result === 'authenticated') {
    return `Websocket authenticated!`;
  }
  if (
    event.method === 'update' &&
    event.params &&
    event.params.type &&
    event.params.id
  ) {
    return `${capitalizeFirstLetter(event.params.type)} ${
      event.params.id
    } updated!`;
  }
  return null;
};

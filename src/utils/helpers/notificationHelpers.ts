import { JSONRPCRequestType, NotificationType } from '../../types';
import { formatAddress } from '../address';
import { capitalizeFirstLetter } from '../string';

export const getNotificationObject = (
  event: JSONRPCRequestType
): NotificationType | null => {
  if (event.method && event.params && event.params.type && event.params.id) {
    switch (event.method) {
      case 'success':
        return {
          text: `${capitalizeFirstLetter(event.params.type)} ${formatAddress(
            event.params.id
          )} ${event.params.type === 'offer' ? 'created' : 'placed'}!`,
          props: {
            variant: 'success',
          },
        };
      case 'creation':
        return {
          text: `${capitalizeFirstLetter(event.params.type)} ${formatAddress(
            event.params.id
          )} ${event.params.type === 'offer' ? 'created' : 'placed'}!`,
          props: {
            variant: 'success',
          },
        };
      case 'completion':
        return {
          text: `${capitalizeFirstLetter(event.params.type)} ${formatAddress(
            event.params.id
          )} ${event.params.type === 'offer' ? 'completed' : 'completed'}!`,
          props: {
            variant: 'success',
          },
        };
      case 'complete':
        return {
          text: `${capitalizeFirstLetter(event.params.type)} ${formatAddress(
            event.params.id
          )} ${event.params.type === 'offer' ? 'completed' : 'completed'}!`,
          props: {
            variant: 'success',
          },
        };
      case 'failure':
        return {
          text: `${capitalizeFirstLetter(event.params.type)} ${formatAddress(
            event.params.id
          )} ${event.params.type === 'offer' ? 'creation' : 'placing'} failed.`,
          props: {
            variant: 'error',
          },
        };
      case 'activationDeactivation':
        return {
          text: `${capitalizeFirstLetter(event.params.type)} ${formatAddress(
            event.params.id
          )} updated now!`,
          props: {
            variant: 'success',
          },
        };
      default:
        return null;
    }
  }

  return null;
};

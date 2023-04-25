export enum OrderPlacingStatusType {
  UNINITIALIZED = '',
  WAITING_NETOWORK_SWITCH = 'Switch network in MetaMask',
  WAITING_CONFIRMATION = 'Confirm the transaction in MetaMask',
  PROCESSING = 'Transaction processing',
  COMPLETED = 'Your order has been placed!',
  ERROR = 'Error',
}

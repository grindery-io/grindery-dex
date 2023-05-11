export enum OrderPlacingStatusType {
  UNINITIALIZED = '',
  WAITING_NETWORK_SWITCH = 'Switch network in MetaMask',
  WAITING_APPROVAL = 'Approve tokens in MetaMask',
  PROCESSING_APPROVAL = 'Processing approval transaction',
  APPROVED = 'Tokens approved',
  WAITING_CONFIRMATION = 'Confirm the transaction in MetaMask',
  PROCESSING = 'Transaction processing',
  COMPLETED = 'Your order has been placed!',
  ERROR = 'Error',
  UNAUTHENTICATED = 'Connect MetaMask wallet',
}

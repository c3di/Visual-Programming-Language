export enum ConnectionAction {
  Reject = 'reject',
  Allowed = 'allowed',
  Replace = 'replace',
}

export interface ConnectionStatus {
  action: ConnectionAction;
  message?: string;
}

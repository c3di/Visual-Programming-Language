import { type HandleType } from 'reactflow';

export enum ConnectionAction {
  Reject = 'reject',
  Allowed = 'allowed',
  Replace = 'replace',
}

export interface ConnectionStatus {
  action: ConnectionAction;
  message?: string;
}

export interface OnConnectStartParams {
  nodeId: string | null;
  handleId: string | null;
  handleType: HandleType | null;
}

import { type SvgIconProps } from '@mui/material/SvgIcon';
import {
  useRef,
  useState,
  useCallback,
  type SetStateAction,
  type Dispatch,
  type MutableRefObject,
} from 'react';
import { type ConnectionStatus } from '../types';

export interface Command {
  name: string;
  action: () => void;
  labelIcon?: React.ElementType<SvgIconProps> | undefined;
  labelInfo?: string;
  tooltip?: string;
}

export interface Gui {
  showNodeMenu: boolean;
  showEdgeMenu: boolean;
  showHandleMenu: boolean;
  showSearchMenu: boolean;
  showConnectionTip: boolean;
  connectionStatus: ConnectionStatus | undefined;
  setconnectionStatus: Dispatch<SetStateAction<ConnectionStatus | undefined>>;
  openWidget: (menu: string) => void;
  closeWidget: () => void;
  clickedHandle: React.MutableRefObject<{
    connection: number;
    id: string;
  } | null>;
  clickedNodeId: React.MutableRefObject<string | null>;
  PosiontOnGui: { top: number; left: number };
  setPosiontOnGui: (PosiontOnGui: { top: number; left: number }) => void;
  connectionStartNodeId: MutableRefObject<string | null>;
}

export default function useGui(): Gui {
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [showEdgeMenu, setShowEdgeMenu] = useState(false);
  const [showHandleMenu, setShowHandleMenu] = useState(false);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showConnectionTip, setShowConnectionTip] = useState(false);
  const connectionStartNodeId = useRef<string | null>(null);
  const [connectionStatus, setconnectionStatus] = useState<
    ConnectionStatus | undefined
  >(undefined);
  const clickedHandle = useRef(null);
  const clickedNodeId = useRef(null);
  const [PosiontOnGui, setPosiontOnGui] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const menuSetter = {
    node: setShowNodeMenu,
    edge: setShowEdgeMenu,
    handle: setShowHandleMenu,
    search: setShowSearchMenu,
    connectionTip: setShowConnectionTip,
  };

  const openWidget = useCallback((menu: string): void => {
    Object.entries(menuSetter).forEach(([name, setter]) => {
      setter(name === menu);
    });
  }, []);

  const closeWidget = useCallback((): void => {
    Object.values(menuSetter).forEach((setter) => {
      setter(false);
    });
  }, []);

  return {
    showNodeMenu,
    showEdgeMenu,
    showHandleMenu,
    showSearchMenu,
    showConnectionTip,
    connectionStatus,
    setconnectionStatus,
    clickedHandle,
    clickedNodeId,
    PosiontOnGui,
    setPosiontOnGui,
    connectionStartNodeId,
    openWidget,
    closeWidget,
  };
}

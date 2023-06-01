import React, {
  useRef,
  useState,
  useCallback,
  type MutableRefObject,
} from 'react';
import { type SvgIconProps } from '@mui/material/SvgIcon';
import {
  ConnectionTip,
  SearchMenu,
  NodeMenu,
  EdgeMenu,
  HandleMenu,
  GetterSetterMenu,
} from '../gui';

export interface Command {
  name: string;
  action: () => void;
  labelIcon?: React.ElementType<SvgIconProps> | undefined;
  labelInfo?: string;
  tooltip?: string;
  category?: string;
  rank?: number;
  categoryRank?: number;
}

export interface IGui {
  widget: JSX.Element | null;
  openWidget: (
    name: string,
    anchorPosition: { top: number; left: number },
    options?: Record<string, unknown>
  ) => void;
  closeWidget: () => void;
  clickedHandle: React.MutableRefObject<{
    connection: number;
    id: string;
  } | null>;
  clickedNodeId: React.MutableRefObject<string | null>;
  connectionStartNodeId: MutableRefObject<string | null>;
}

export default function useGui(): IGui {
  const [widget, setWidget] = useState<JSX.Element | null>(null);
  const connectionStartNodeId = useRef<string | null>(null);
  const clickedHandle = useRef(null);
  const clickedNodeId = useRef(null);

  const closeWidget = useCallback((): void => {
    setWidget(null);
  }, []);

  const widgetRegistry: Record<string, any> = {
    connectionTip: ConnectionTip,
    search: SearchMenu,
    nodeMenu: NodeMenu,
    edgeMenu: EdgeMenu,
    handleMenu: HandleMenu,
    getterSetterMenu: GetterSetterMenu,
  };

  const openWidget = useCallback(
    (
      name: string,
      anchorPosition: { top: number; left: number },
      options?: Record<string, unknown>
    ): void => {
      setWidget(
        React.createElement(widgetRegistry[name], {
          onClose: closeWidget,
          anchorPosition,
          ...options,
        })
      );
    },
    [closeWidget, widgetRegistry]
  );

  return {
    widget,
    clickedHandle,
    clickedNodeId,
    connectionStartNodeId,
    openWidget,
    closeWidget,
  };
}

import { type SvgIconProps } from '@mui/material/SvgIcon';
import { useRef, useState, useCallback } from 'react';

export interface Command {
  name: string;
  action: () => void;
  labelIcon?: React.ElementType<SvgIconProps> | undefined;
  labelInfo?: string;
  tooltip?: string;
}

export interface ContextMenu {
  showNodeMenu: boolean;
  showEdgeMenu: boolean;
  showHandleMenu: boolean;
  showSearchMenu: boolean;
  openMenu: (menu: string) => void;
  closeMenu: () => void;
  clickedHandle: React.MutableRefObject<{
    connection: number;
    id: string;
  } | null>;
  clickedNodeId: React.MutableRefObject<string | null>;
  contextMenuPosiont: { top: number; left: number };
  setContextMenuPosition: (contextMenuPosiont: {
    top: number;
    left: number;
  }) => void;
}

export default function useContextMenu(): ContextMenu {
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [showEdgeMenu, setShowEdgeMenu] = useState(false);
  const [showHandleMenu, setShowHandleMenu] = useState(false);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const clickedHandle = useRef(null);
  const clickedNodeId = useRef(null);
  const [contextMenuPosiont, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const menuSetter = {
    node: setShowNodeMenu,
    edge: setShowEdgeMenu,
    handle: setShowHandleMenu,
    search: setShowSearchMenu,
  };

  const openMenu = useCallback((menu: string): void => {
    Object.entries(menuSetter).forEach(([name, setter]) => {
      setter(name === menu);
    });
  }, []);

  const closeMenu = useCallback((): void => {
    Object.values(menuSetter).forEach((setter) => {
      setter(false);
    });
  }, []);

  return {
    showNodeMenu,
    showEdgeMenu,
    showHandleMenu,
    showSearchMenu,
    clickedHandle,
    clickedNodeId,
    contextMenuPosiont,
    setContextMenuPosition,
    openMenu,
    closeMenu,
  };
}

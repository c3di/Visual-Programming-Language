import { useRef, useState } from 'react';

export default function useContextMenu(): {
  showNodeMenu: boolean;
  setShowNodeMenu: (showNodeMenu: boolean) => void;
  showEdgeMenu: boolean;
  setShowEdgeMenu: (showEdgeMenu: boolean) => void;
  showHandleMenu: boolean;
  setShowHandleMenu: (showHandleMenu: boolean) => void;
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
} {
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [showEdgeMenu, setShowEdgeMenu] = useState(false);
  const [showHandleMenu, setShowHandleMenu] = useState(false);
  const clickedHandle = useRef(null);
  const clickedNodeId = useRef(null);
  const [contextMenuPosiont, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  return {
    showNodeMenu,
    setShowNodeMenu,
    showEdgeMenu,
    setShowEdgeMenu,
    showHandleMenu,
    clickedHandle,
    clickedNodeId,
    setShowHandleMenu,
    contextMenuPosiont,
    setContextMenuPosition,
  };
}

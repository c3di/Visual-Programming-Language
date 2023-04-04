import { useState } from 'react';

export default function useContextMenu(): {
  showNodeMenu: boolean;
  setShowNodeMenu: (showNodeMenu: boolean) => void;
  showEdgeMenu: boolean;
  setShowEdgeMenu: (showEdgeMenu: boolean) => void;
  contextMenuPosiont: { top: number; left: number };
  setContextMenuPosition: (contextMenuPosiont: {
    top: number;
    left: number;
  }) => void;
} {
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [showEdgeMenu, setShowEdgeMenu] = useState(false);
  const [contextMenuPosiont, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  return {
    showNodeMenu,
    setShowNodeMenu,
    showEdgeMenu,
    setShowEdgeMenu,
    contextMenuPosiont,
    setContextMenuPosition,
  };
}

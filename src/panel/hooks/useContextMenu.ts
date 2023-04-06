import { useCallback, useRef, useState } from 'react';

export interface Command {
  name: string;
  onClick: () => void;
}

export default function useContextMenu(): {
  showNodeMenu: boolean;
  setShowNodeMenu: (showNodeMenu: boolean) => void;
  showEdgeMenu: boolean;
  setShowEdgeMenu: (showEdgeMenu: boolean) => void;
  showHandleMenu: boolean;
  setShowHandleMenu: (showHandleMenu: boolean) => void;
  showSearchMenu: boolean;
  setShowSearchMenu: (showSearchMenu: boolean) => void;
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
  extraCommands: Command[];
  addExtraCommands: (extraCommands: Command[]) => void;
  removeExtraCommand: (name: string) => void;
} {
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
  const [extraCommands, setExtraCommands] = useState<Command[]>([
    {
      name: 'test',
      onClick: () => {
        console.log('test');
      },
    },
  ]);
  const addExtraCommands = useCallback((extraCommands: Command[]): void => {
    setExtraCommands([...extraCommands, ...extraCommands]);
  }, []);

  const removeExtraCommand = useCallback((name: string): void => {
    setExtraCommands(extraCommands.filter((command) => command.name !== name));
  }, []);

  return {
    showNodeMenu,
    setShowNodeMenu,
    showEdgeMenu,
    setShowEdgeMenu,
    showHandleMenu,
    showSearchMenu,
    setShowSearchMenu,
    clickedHandle,
    clickedNodeId,
    setShowHandleMenu,
    contextMenuPosiont,
    setContextMenuPosition,
    extraCommands,
    addExtraCommands,
    removeExtraCommand,
  };
}

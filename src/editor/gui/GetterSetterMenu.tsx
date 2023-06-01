import { type NodeConfig } from '../types';
import { type IMenuItem, CreateMenu } from './elements';

export default function GetterSetterMenu({
  onClose,
  anchorPosition,
  addNode,
}: {
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  nodeConfig: NodeConfig;
  addNode?: (configType: string) => void;
}): JSX.Element {
  const items: IMenuItem[] = [
    {
      title: 'Get',
      action: () => {
        addNode?.('extension1.module1.getter');
        onClose();
      },
    },
    {
      title: 'Set',
      action: () => {
        addNode?.('extension1.module1.setter');
        onClose();
      },
    },
  ];
  return CreateMenu(
    true,
    onClose,
    anchorPosition,
    items,
    undefined,
    undefined,
    {
      width: '150px',
    }
  );
}

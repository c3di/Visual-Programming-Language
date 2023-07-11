import { useSceneState } from '../Context';
import { type NodeConfig } from '../types';
import { type IMenuItem, CreateMenu } from './elements';

export default function GetterSetterMenu({
  onClose,
  anchorPosition,
  createVarNodeRef,
}: {
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  nodeConfig: NodeConfig;
  createVarNodeRef?: string;
}): JSX.Element {
  const { addNode, getNodeById } = useSceneState()?.sceneActions ?? {};
  const node = getNodeById?.(createVarNodeRef ?? '');
  if (!node) {
    onClose();
  }
  const handleData = {
    title:
      node?.data?.inputs.name?.value ?? node?.data?.inputs.name?.defaultValue,
    dataType:
      node?.data?.inputs.type?.value ?? node?.data?.inputs.type?.defaultValue,
    value:
      node?.data?.inputs.value?.value ?? node?.data?.inputs.value?.defaultValue,
  };

  const items: IMenuItem[] = [
    {
      title: 'Get',
      action: () => {
        addNode?.('extension1.module1.getter', undefined, {
          nodeRef: createVarNodeRef,
          outputs: {
            getter: handleData,
          },
        });
        onClose();
      },
    },
    {
      title: 'Set',
      action: () => {
        addNode?.('extension1.module1.setter', undefined, {
          nodeRef: createVarNodeRef,
          inputs: {
            execIn: { title: 'execIn', dataType: 'exec', tooltip: 'exec in' },
            setter: handleData,
          },
          outputs: {
            'setter-out': handleData,
          },
        });
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
      width: '80px',
    }
  );
}

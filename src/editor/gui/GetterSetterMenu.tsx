import { useSceneState } from '../Context';
import { type NodeConfig } from '../types';
import { CreateMenu, type IMenuItem } from './elements';

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
    value:
      node?.data?.inputs.value?.value ?? node?.data?.inputs.value?.defaultValue,
    dataType: 'anyDataType',
  };

  const items: IMenuItem[] = [
    {
      title: 'Get',
      action: () => {
        addNode?.('Function & Variable Creation.getter', undefined, {
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
        addNode?.('Function & Variable Creation.setter', undefined, {
          nodeRef: createVarNodeRef,
          inputs: {
            execIn: { title: 'execIn', dataType: 'exec', tooltip: 'exec in' },
            setter: handleData,
          },
          outputs: {
            setter_out: handleData,
          },
        });
        onClose();
      },
    },
  ];
  return CreateMenu({
    open: true,
    onClose: onClose,
    anchorPosition: anchorPosition,
    items: items,
    menuStyle: { width: '80px' }
  });
}
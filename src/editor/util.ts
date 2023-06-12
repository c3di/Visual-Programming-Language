import { useSceneState } from './Context';
import { type VariableNodeData } from './types';

export function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export function registVariableRef(
  data: VariableNodeData,
  thisId: string
): void {
  const varsNamePool = useSceneState()?.varsNamePool.current;
  const getNodeById = useSceneState()?.sceneActions.getNodeById;
  const node = getNodeById?.(data.nodeRef ?? '');
  if (data.nodeRef) {
    varsNamePool?.addRef(
      node?.data.inputs.name.value ?? node?.data.inputs.name.defaultValue,
      thisId
    );
  }
}

export function stringArrayToObject(array: string[]): Record<string, string> {
  const obj: Record<string, string> = {};
  array.forEach((item) => {
    obj[item] = item;
  });
  return obj;
}

import { useSceneState } from './Context';
import { type ConnectableData, type VariableNodeData } from './types';
import { type XYPosition } from 'reactflow';

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

export function registFunctionRef(data: ConnectableData, thisId: string): void {
  const funNamePool = useSceneState()?.funNamePool.current;
  const getNodeById = useSceneState()?.sceneActions.getNodeById;
  const node = getNodeById?.(data.nodeRef ?? '');
  if (data.nodeRef) {
    funNamePool?.addRef(node?.data.title, thisId);
  }
}

export function stringArrayToObject(array: string[]): Record<string, string> {
  const obj: Record<string, string> = {};
  array.forEach((item) => {
    obj[item] = item;
  });
  return obj;
}

export function fromClientCoordToScene(
  clientCoord: { clientX: number; clientY: number },
  domRefCurrent: React.RefObject<HTMLDivElement>,
  project: any // project from view to scene
): XYPosition {
  const bounding = domRefCurrent.current?.getBoundingClientRect();
  if (!bounding) return { x: clientCoord.clientX, y: clientCoord.clientY };
  const projectedPosition = project({
    x: clientCoord.clientX - bounding.left,
    y: clientCoord.clientY - bounding.top,
  });
  return projectedPosition;
}

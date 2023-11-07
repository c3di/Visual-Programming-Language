import { readFileSync } from 'fs';
import { deserializer } from '../src/editor/Deserializer';
import { Node } from '../src/editor/types';

export function readJsonFileSync(filePath: string): any {
  const rawData = readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

/**
 *
 * @param jsonPath relative to the root directory
 * @param nodeName
 * @returns
 */
export function loadNode(jsonPath: string, nodeName: string): Node {
  const packageJson = readJsonFileSync(jsonPath);
  const nodeConfig = packageJson.nodes[nodeName];
  if (!nodeConfig) throw new Error(`node ${nodeName} not found in ${jsonPath}`);
  return deserializer.configToNode(nodeConfig);
}

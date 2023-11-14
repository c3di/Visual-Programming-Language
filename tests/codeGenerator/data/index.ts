import path from 'path';
import { deserializer } from '../../../src/editor/Deserializer';
import { VisualProgram } from '../../../src/editor/generators';
import { readJsonFileSync } from '../../loader';

/**
 * load the visual program data from the file in the data folder
 * @param file_name : the file name in the data folder
 * @returns VisualProgram
 */
export function loadVisualProgram(file_name: string): VisualProgram {
  const filePath = path.join(__dirname, file_name);
  const file = readJsonFileSync(filePath);
  const graph = deserializer.deserialize(file);
  return new VisualProgram(graph.nodes, graph.edges);
}

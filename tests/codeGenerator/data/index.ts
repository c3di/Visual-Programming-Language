import path from 'path';
import { readJsonFileSync } from '../../loader';

/**
 * load the visual program data from the file in the data folder
 * @param file_name : the file name in the data folder
 * @returns
 */
export function loadVisualProgram(file_name: string) {
  const filePath = path.join(__dirname, file_name);
  return readJsonFileSync(filePath);
}

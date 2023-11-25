import { exec } from 'child_process';
import { unlink, writeFile } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Node } from '../src/editor';
import { pythonGenerator } from '../src/editor/generators';

const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);
const execAsync = promisify(exec);

// todo search the path to your Anaconda installation
const anacondaPath = 'C:\\Users\\luwa02\\AppData\\Local\\anaconda3';

const condaEnvName = `temp_conda_env_for_chaldene_test`;

function activateEnvCmd(condaEnv: string) {
  return `CALL "${anacondaPath}\\Scripts\\activate.bat" ${condaEnv}`;
}

async function execCondaCommand(command: string) {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    console.error(`Error exec conda command: ${error}`);
    throw error;
  }
}

export async function createCondaEnvironment() {
  console.log('Creating conda environment...', condaEnvName);
  const command = `${activateEnvCmd(
    'base'
  )} && conda create --name ${condaEnvName} python=3.10 -y`;
  //todo install the packages in the env

  // it works for creating the env, but the packages are not installed, so
  // we manually install the packages in the env
  //await execCondaCommand(command);
}

export async function removeCondaEnvironment() {
  const command = `${activateEnvCmd(
    'base'
  )} && conda env remove --name ${condaEnvName} -y`;
  // todo: after finish the feature of the package installation from the config file, now we
  // manually install the packages in the env
  // await execCondaCommand(command);
}

export async function execPythonCode(pythonCode: string): Promise<boolean> {
  const tempFileName = path.join(__dirname, `temp_${Date.now()}.py`);
  try {
    await writeFileAsync(tempFileName, pythonCode);
    const command = `${activateEnvCmd(
      condaEnvName
    )} && python "${tempFileName}"`;
    console.log('Executing Python code...', command);
    const { stdout, stderr } = await execAsync(command);
    if (stderr) throw new Error(stderr);
    return stdout.trim().toLowerCase() === 'true';
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  } finally {
    try {
      await unlinkAsync(tempFileName);
    } catch (unlinkErr) {
      console.error(`Error deleting temporary file: ${unlinkErr}`);
    }
  }
}

export async function nodeExecCheck(
  node: Node,
  inputs: string[],
  outputs: string[],
  expectedCode: string,
  inputPrepareCode?: string
) {
  const sourceCode = pythonGenerator.nodeSourceGeneration(
    node,
    inputs,
    outputs
  );
  const importCode = node.data.externalImports;
  const code = inputPrepareCode
    ? `${importCode}\n${inputPrepareCode}\n${sourceCode}`
    : `${importCode}\n${sourceCode}`;
  expect(code).toBe(expectedCode);
  const assertion = await execPythonCode(code);
  expect(assertion).toBe(true);
}

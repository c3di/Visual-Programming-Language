import { LoadDefaultModule } from '../../src/editor/extension/LoadPackageToRegistry';
import { GenResult, pythonGenerator } from '../../src/editor/generators';
import { execPythonCode } from '../execution';
import { loadVisualProgram } from './data';

interface testProgram {
  path: string;
  expected: any;
}

describe('Code Generation and Execution of Visual Program', () => {
  beforeAll(() => {
    LoadDefaultModule();
  });

  const testData: testProgram[] = [
    {
      path: 'onlyMain.json',
      expected: new GenResult([], ''),
    },
    {
      path: 'nonMain.json',
      expected: new GenResult([
        { type: 'warning', message: 'No "main" entry node found' },
      ]),
    },
    {
      path: 'controlFlow.json',
      expected: new GenResult(
        [],
        `print('s')
print(54)
if True:
  print('s2')
  print(5445)
else:
  if True:
    pass
  else:
    if True:
      for n_7_index, n_7_element in enumerate([]):
        print(n_7_index)
        n_23_output = n_7_element
        print(n_23_output)
      if True:
        print(finish)
        for n_15_index in range(0, 2):
          print(n_15_index)
        print(True)
        for n_18_index, n_18_element in enumerate([]):
          for n_19_index in range(0, 2):
            if True:
              pass`
      ),
    },
    // variable declaration, get and set
    {
      path: 'variable.json',
      expected: new GenResult(
        [],
        `n_3_in_out = 2
if n_3_in_out:
  n_3_in_out = 2
  n_12_in_out = 4
  n_11_in_out = n_12_in_out
  n_10_out = n_3_in_out + 3 + n_11_in_out
  hello = n_10_out
  for n_2_index in range(0, 2):
    n_5_getter = hello
    n_15_out = n_2_index + n_5_getter
    hello = n_15_out
    n_14_setter_out = hello
  n_3_in_out = 2
  n_12_in_out = 4
  n_11_in_out = n_12_in_out
  n_10_out = n_3_in_out + 3 + n_11_in_out
  n_13_out = n_10_out - 6
  n_9_getter = hello
  n_6_out = n_13_out + n_9_getter
  hello = n_6_out
  n_7_setter_out = hello
  print(n_7_setter_out)`
      ),
    },
    // function with && without return, and nested function call
    {
      path: 'functions.json',
      expected: new GenResult(
        [],
        `def newFun_1(n_3_out_0):
  return n_3_out_0
def newFun_0(n_0_out_0):
  hello = n_0_out_0
  n_16_output = n_0_out_0
  n_10_in_1 = newFun_1(n_16_output)
  n_8_getter = hello
  n_1_output = n_10_in_1
  n_9_out = n_8_getter + 3 + n_1_output
  n_14_output = n_9_out
  return n_14_output
n_13_in_0 = newFun_0(3)
n_5_in_1 = newFun_1(n_13_in_0)
n_11_out = 3 + n_5_in_1
n_15_output = n_11_out
print(n_15_output)`
      ),
    },
  ];
  test.each(testData)('Test %s.path', async (data) => {
    const program = loadVisualProgram(data.path);
    const actual = pythonGenerator.programToCode(program);
    expect(actual.messages).toEqual(data.expected.messages);
    expect(actual.code).toEqual(data.expected.code);
    await execPythonCode(actual.code);
  });
});
export {};

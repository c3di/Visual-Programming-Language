describe('pythonGenerator.programToCode', () => {
  beforeEach(() => {});

  test('placeholder', () => {
    expect(2 - 2).toBe(0);
  });
});
export {};

// todo: write the unit tests in the following cases for `deleteHandle` callback
// create a function -> create a function call -> add the return value -> connect to function definition node -> add / delete the output, input
// => check if the function call nodes updates
// -> add new function call node => check if the function call node updates
// -> delete the return node => check if the function call node updates

// create a function -> create a function call -> add the return value -> add / delete the output, input -> connect to function definition node
// => check if the function call nodes updates
// -> add new function call node => check if the function call node updates
// -> delete the return node => check if the function call node updates

// create a function -> create a return node -> add the return value -> connect to function definition node -> add / delete the output, input
// => check if the function call nodes updates
// -> create another function -> create another return node -> add the return value -> connect to function definition node -> add / delete the output, input
// => check if the function call nodes updates

// delete one input or output => check if the function call nodes updates

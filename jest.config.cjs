module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './tests/jest.global-setup.ts',
  globalTeardown: './tests/jest.global-teardown.ts',
};

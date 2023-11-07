import { createCondaEnvironment } from './execution';

module.exports = async () => {
  console.log('Setting up tests...');
  await createCondaEnvironment();
};

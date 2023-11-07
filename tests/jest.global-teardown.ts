import { removeCondaEnvironment } from './execution';

module.exports = async () => {
  console.log('Tearing down tests...');
  await removeCondaEnvironment();
};

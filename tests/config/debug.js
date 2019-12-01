import { seed } from '../util/seed';

const server = require('./globalSetup');

const startDebug = async () => {
  await server();
  await seed(true);
};

startDebug();

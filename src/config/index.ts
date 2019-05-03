import testConfig from './config.test';
import prodConfig from './config.prod';
import { NODE_ENV } from '../enums';

const assignDeep = require('assign-deep');

export const defaultConfig = {
  env: NODE_ENV.dev,
  port: 3001,
};

let envConfig: any;
const env = process.env.NODE_ENV;
switch (env) {
  case NODE_ENV.test:
    envConfig = testConfig;
    break;
  case NODE_ENV.prod:
    envConfig = prodConfig;
  default:
}

assignDeep(defaultConfig, envConfig);

export default defaultConfig;

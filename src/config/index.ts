import { defaultConfig } from './config.default';
import testConfig from './config.test';
import prodConfig from './config.prod';
import { NODE_ENV } from '../enums';

let envConfig: any;
const env = process.env.NODE_ENV;
switch (env) {
  case NODE_ENV.test:
    envConfig = testConfig;
    break;
  default:
    envConfig = prodConfig;
}

Object.assign(defaultConfig, envConfig);

export default defaultConfig;

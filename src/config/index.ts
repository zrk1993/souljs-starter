import defaultConfig from './config.default';
import devConfig from './config.dev';
import testConfig from './config.test';
import prodConfig from './config.prod';
import { SERVER_ENV } from '../src/enums';

interface IConfig {
  env: SERVER_ENV;
  port: number;
}

let envConfig: any;
const env = process.env.SERVER_ENV;
switch (env) {
  case SERVER_ENV.dev:
    envConfig = devConfig;
    break;
  case SERVER_ENV.test:
    envConfig = testConfig;
    break;
  default:
    envConfig = prodConfig;
}

const config: IConfig = Object.assign(defaultConfig, envConfig);

export default config;

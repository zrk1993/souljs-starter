import { createApplication } from 'souljs';
import * as koaLogger from 'koa-logger';
import { NODE_ENV } from './enums';
import config from './config';
import getLogger from './utils/log4js';

async function main() {
  const app = await createApplication(__dirname, '*.controller.ts', {
    logger: getLogger('app'),
    hbs: { disableCache: config.env === NODE_ENV.dev },
  });

  if (config.env === NODE_ENV.dev) {
    app.use(koaLogger());
  }

  app.listen(config.port);
}

main();

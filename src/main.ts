import { createApplication } from 'souljs';
import * as koaLogger from 'koa-logger';
import { NODE_ENV } from '../src/enums';
import config from './config';
import getLogger from './utils/log4js';
import errorHandle from './middleware/error-handle';

async function main() {
  const app = await createApplication(__dirname, '/controller/**/*controller.ts', {
    logger: getLogger('app'),
    staticAssets: { root: 'public', prefix: '/static' },
    hbs: { disableCache: config.env === NODE_ENV.dev },
  });

  if (config.env === NODE_ENV.dev) {
    app.use(koaLogger());
  }

  app.use(errorHandle());

  app.listen(config.port);
}

main();

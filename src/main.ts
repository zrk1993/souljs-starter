import { createApplication } from 'souljs';
import * as koaLogger from 'koa-logger';
import { NODE_ENV } from './enums';
import config from './config';
import getLogger from './utils/log4js';
import errorHandle from './middleware/error-handle';
import session from './middleware/app-session';
import { appJwt } from './middleware/app-jwt';

async function main() {
  const app = await createApplication(__dirname, '/controller/*controller.ts', {
    logger: getLogger('app'),
    hbs: { disableCache: config.env === NODE_ENV.dev },
  });

  if (config.env === NODE_ENV.dev) {
    app.use(koaLogger());
  }

  app.use(session(app.getKoaInstance()));

  app.use(appJwt());

  app.use(errorHandle());

  app.listen(config.port);
}

main();

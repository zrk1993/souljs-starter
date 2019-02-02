import { createApplication } from 'souljs';
import * as koaLogger from 'koa-logger';
import getLogger from './utils/log4js';

async function main() {
  const app = await createApplication(__dirname, '*.controller.ts', {
    logger: getLogger('app'),
    hbs: { disableCache: true },
  });

  app.use(koaLogger());

  app.listen(8080);
}

main();

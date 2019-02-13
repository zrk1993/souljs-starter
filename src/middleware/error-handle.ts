import * as Koa from 'koa';
import { Application } from 'souljs';
import getLogger from '../utils/log4js';

const logger = getLogger('error-handle.ts');

export default (app: Application) => {
  app.getKoaInstance().on('error', (err: Error, ctx: Koa.Context) => {
    if (ctx.accepts('json')) {
      ctx.body = {};
    } else {
      ctx.body = '<h1>404</h1>';
    }
    logger.error('server error', err, ctx);
  });
}
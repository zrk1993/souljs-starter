import * as Koa from 'koa';
import { PARAM_VALIDATIONE_RROR } from 'souljs';
import getLogger from '../utils/log4js';
import { ResultUtils } from '../utils/result-utils';

const logger = getLogger('error-handle.ts');

export default () => {
  return async (ctx: Koa.Context, next: () => void) => {
    try {
      await next();
    } catch (error) {
      if (error.name === PARAM_VALIDATIONE_RROR) {
        return (ctx.body = ResultUtils.badRequest(error.message));
      }

      ResultUtils.internalServerError(error.message);
      logger.error('server error：', error);
    }
  };
};

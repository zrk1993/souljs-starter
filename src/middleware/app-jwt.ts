import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';
import unless = require('koa-unless');
// import { redis } from '../utils/redis';
import { ResultUtils } from '../utils/result-utils';

const secret = 'hahahahahah';

export const sign = (data: object): string => {
  const token = jwt.sign(data, secret, { expiresIn: '2h' });
  return token;
};

export const verify = (token: string): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      error ? reject(error) : resolve(decoded);
    });
  });
};

export const middleware: any = async (ctx: Koa.Context, next: () => void) => {
  const token = ctx.header.authorization || ctx.cookies.get('authorization');
  if (token) {
    try {
      await verify(token);
      // const sess = (await redis.get(token)) || '{}';
      // ctx.session = JSON.parse(sess);
      await next();
      // await redis.set(token, JSON.stringify(ctx.session), 'PX', 1000 * 60 * 60 * 2);
    } catch (error) {
      ctx.body = ResultUtils.forbidden(error.name);
    }
  } else {
    ctx.body = ResultUtils.forbidden('token not fund!');
  }
};

export const appJwt = () => {
  middleware.unless = unless;
  return middleware.unless({ method: 'OPTIONS', path: [/^\/static/, /^\/user\/login/] });
};

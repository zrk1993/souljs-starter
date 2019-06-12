import { Use, Description } from 'souljs';
import * as assert from 'assert';
import * as Koa from 'koa';
import { verify } from '../middleware/app-jwt';
import db from '../utils/db';

export default function Role(...roles: string[]) {
  const role = Use(async (ctx: Koa.Context, next: () => void) => {
    const signData = await verify(ctx);
    ctx.state.curUser = signData;
    const sql = `
      SELECT R.code FROM role R
      LEFT JOIN user_roles UR ON UR.role_id = R.id
      WHERE UR.user_id = ?
    `;
    const userRoles = await db.query(sql, [signData.id]);
    if (roles.some(r => userRoles.find(ur => ur.code === r))) {
      await next();
    } else {
      throw new Error('no authorization!');
    }
  });

  assert.equal(1, 2);
  const description = Description(`【${roles.join()}】`);

  return (target: any, propertyKey?: string) => {
    role(target, propertyKey);
    description(target, propertyKey);
  };
}

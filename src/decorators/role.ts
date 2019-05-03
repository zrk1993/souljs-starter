
import { Use } from 'souljs';
import * as Koa from 'koa';
import { verify } from '../middleware/app-jwt';
import * as db from '../utils/db';

export default function Role(...roles: string[]) {
  return Use(async (ctx: Koa.Context, next: () => void) => {
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
}

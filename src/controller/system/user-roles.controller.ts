import { Controller, Get, QuerySchame, Query, Post, BodySchame, Body, Description, Tag } from 'souljs';
import * as joi from 'joi';
import { ResultUtils } from '../../utils/result-utils';
import db from '../../utils/db';
import Role from '../../decorators/role';
import CurUser from '../../decorators/cur-user';
import { SYS_ROLE } from '../../../src/enums';

@Controller('/system/user-roles')
@Role(SYS_ROLE.admin)
export default class UserRoles {
  @Get('/list')
  @Description('用户的角色')
  @QuerySchame({
    id: joi.string().required(),
  })
  async list(@Query() query: any) {
    const sql = `
      SELECT R.id, R.code, R.name FROM role R
      LEFT JOIN user_roles UR ON UR.role_id = R.id
      WHERE UR.user_id = ?
    `;
    const roles = await db.query(sql, [query.id]);
    return ResultUtils.success(roles);
  }

  @Post('/set-roles')
  @Description('分配角色')
  @BodySchame({
    id: joi.string().required(),
    roles: joi.array().items(joi.string()),
  })
  async setRoles(@Body() body: any) {
    const id = body.id;
    const roles: any[] = body.roles;

    const tx = await db.beginTx();
    try {
      await tx
        .table('user_roles')
        .where({ user_id: id })
        .delete();
      if (roles.length) {
        await tx.table('user_roles').insert(roles.map((role_id: string) => ({ user_id: id, role_id })));
      }
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      return ResultUtils.badRequest(error.message);
    }

    return ResultUtils.success();
  }
}

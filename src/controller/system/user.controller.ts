import { Controller, Get, QuerySchame, Query, Ctx, Post, BodySchame, Body, ApiDescription } from 'souljs';
import * as joi from 'joi';
import * as Koa from 'koa';
import { SYS_ROLE } from '../../enums';
import { ResultUtils } from '../../utils/result-utils';
import * as db from '../../utils/db';
import md5 from '../../utils/md5';
import uuid from '../../utils/uuid';
import * as appJwt from '../../middleware/app-jwt';
import Role from '../../decorators/role';
import CurUser from '../../decorators/cur-user';
import reCartesian from '../../utils/re-cartesian';

@Controller('/user')
export default class User {
  @Post('/login')
  @ApiDescription('用户登陆')
  @BodySchame(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
  }))
  async login(@Body() body: any, @Ctx() ctx: Koa.Context) {
    const where = {
      username: body.username,
      password: md5(body.password),
      enable: 1
    };
    const user = await db.table('user').where(where).find();
    const token = appJwt.sign({
      id: user.id,
      username: user.username,
    });
    ctx.cookies.set('authorization', token);
    return ResultUtils.success({ token });
  }

  @Get('/logout')
  @ApiDescription('退出')
  async logout(@Ctx() ctx: Koa.Context) {
    ctx.cookies.set('authorization', '');
    return ResultUtils.success();
  }

  @Get('/info')
  @Role(SYS_ROLE.admin, SYS_ROLE.agent, SYS_ROLE.merchant)
  @ApiDescription('用户信息')
  async info(@CurUser() curUser: any) {
    const user = await db.table('user').where({ id: curUser.id, enable: 1 }).find();
    const sql = `
      SELECT R.* FROM role R
      LEFT JOIN user_roles UR ON UR.role_id = R.id
      WHERE UR.user_id = ?
    `;
    const roles = await db.query(sql, [ user.id ]);
    return ResultUtils.success({
      name: user.username,
      roles: roles.map(r => r.code)
    });
  }

  @Get('/list')
  @Role(SYS_ROLE.admin)
  @ApiDescription('用户信息')
  async list() {
    const sql = `
      SELECT U.id, U.username, U.enable, R.name as role_name, R.code as role_code FROM user U
      LEFT JOIN user_roles UR ON UR.user_id = U.id
      LEFT JOIN role R ON R.id = UR.role_id
      ORDER BY role_name DESC
    `;
    const results = await db.query(sql, { nestTables: true });
    const users = reCartesian(results, {
      table: 'U',
      id: 'id',
      hasMany: [{
        table: 'R',
        as: 'roles',
        id: 'role_id'
      }]
    });
    return ResultUtils.success(users);
  }

  @Post('/create')
  @Role(SYS_ROLE.admin)
  @ApiDescription('创建用户')
  @BodySchame(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
  }))
  async create(@Body() body: any) {
    const username = body.username;
    const password = md5(body.password);

    const isExixt = await db.table('user').where({ username }).findOrEmpty();
    if (isExixt) {
      throw new Error('用户名已存在！');
    }

    await db.table('user').insert({
      id: uuid(),
      username,
      password,
    });
    return ResultUtils.success();
  }

  @Post('/enable')
  @Role(SYS_ROLE.admin)
  @ApiDescription('启用用户')
  @BodySchame(joi.object({
    id: joi.string().required(),
  }))
  async enable(@Body() body: any) {
    const id = body.id;
    await db.table('user').where({ id }).update({ enable: 1 });
    return ResultUtils.success();
  }

  @Post('/disable')
  @Role(SYS_ROLE.admin)
  @ApiDescription('启用用户')
  @BodySchame(joi.object({
    id: joi.string().required(),
  }))
  async disable(@Body() body: any) {
    const id = body.id;
    await db.table('user').where({ id }).update({ enable: 0 });
    return ResultUtils.success();
  }
}

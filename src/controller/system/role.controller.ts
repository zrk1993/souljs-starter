import { Controller, Get, QuerySchame, Query, Ctx, Post, BodySchame, Body, ApiDescription } from 'souljs';
import * as joi from 'joi';
import * as Koa from 'koa';
import { ResultUtils } from '../../utils/result-utils';
import * as db from '../../utils/db';
import uuid from '../../utils/uuid';
import { SYS_ROLE } from '../../enums';
import Role from '../../decorators/role';

@Controller('/system/role')
@Role(SYS_ROLE.admin)
export default class RoleController {
  @Get('/list')
  @ApiDescription('角色列表')
  async list() {
    const roles = await db.table('role').select();
    return ResultUtils.success(roles);
  }

  @Get('/info')
  @ApiDescription('角色信息')
  @QuerySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async info(@Query() query: any) {
    const id = query.id;
    const role = await db
      .table('role')
      .where({ id })
      .find();
    return ResultUtils.success(role);
  }

  @Post('/create')
  @ApiDescription('创建角色')
  @BodySchame(
    joi.object({
      code: joi.string().required(),
      name: joi.string().required(),
    }),
  )
  async create(@Body() body: any) {
    const code = body.code;
    const name = body.name;
    await db.table('role').insert({
      id: uuid(),
      code,
      name,
    });
    return ResultUtils.success();
  }

  @Post('/update')
  @ApiDescription('更新角色信息')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
      code: joi.string().required(),
      name: joi.string().required(),
    }),
  )
  async update(@Body() body: any) {
    const id = body.id;
    const code = body.code;
    const name = body.name;
    await db
      .table('role')
      .where({ id })
      .update({ code, name });
    return ResultUtils.success();
  }

  @Post('/remove')
  @ApiDescription('删除角色')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async remove(@Body() body: any) {
    const id = body.id;
    const tx = await db.beginTx();
    try {
      await tx
        .table('user_roles')
        .where({ role_id: id })
        .delete();
      await tx
        .table('role')
        .where({ id })
        .delete();
      await tx.commit();
    } catch (error) {
      await tx.rollback();
    }
    return ResultUtils.success();
  }

  @Post('/enable')
  @ApiDescription('启用角色')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async enable(@Body() body: any) {
    const id = body.id;
    await db
      .table('role')
      .where({ id })
      .update({ enable: 1 });
    return ResultUtils.success();
  }

  @Post('/disable')
  @ApiDescription('启用角色')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async disable(@Body() body: any) {
    const id = body.id;
    await db
      .table('role')
      .where({ id })
      .update({ enable: 0 });
    return ResultUtils.success();
  }
}

import { Controller, Get, QuerySchame, Query, Ctx, Post, BodySchame, Body, ApiDescription } from 'souljs';
import * as joi from 'joi';
import * as Koa from 'koa';
import * as moment from 'moment';
import { ResultUtils } from '../../utils/result-utils';
import * as db from '../../utils/db';
import uuid from '../../utils/uuid';
import { SYS_ROLE } from '../../enums';
import Role from '../../decorators/role';
import CurUser from '../../decorators/cur-user';
import md5 from '../../utils/md5';

@Controller('/merchant')
@Role(SYS_ROLE.admin)
export default class MerchantController {
  @Get('/list')
  @ApiDescription('商户列表')
  async list() {
    const merchants = await db.table('merchant').select();
    return ResultUtils.success(merchants);
  }

  @Get('/info')
  @ApiDescription('商户信息')
  @QuerySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async info(@Query() query: any) {
    const id = query.id;
    const merchant = await db
      .table('merchant')
      .where({ id })
      .find();
    const user = await db
      .table('user')
      .where({ id: merchant.user_id })
      .find();
    merchant.username = user.username;
    return ResultUtils.success(merchant);
  }

  @Post('/create')
  @ApiDescription('创建商户')
  @BodySchame(
    joi.object({
      agentId: joi.string(),
      merchant_name: joi.string().required(),
      username: joi.string().required(),
      liaisons: joi.string().required(),
      tel: joi.string().required(),
      email: joi.string().required(),
      QQ: joi.string().required(),
      payment: joi.string().required(),
      rate: joi.string().required(),
      groupId: joi.string(),
      exchange_rate: joi.string().required(),
      charging_method: joi.string().required(),
      withdraw_charge: joi.string().required(),
      withdraw_charge_method: joi.string().required(),
    }),
  )
  async create(@Body() body: any, @CurUser() curUser: any) {
    const tx = await db.beginTx();
    try {
      // 创建user
      const user_id = uuid();
      await tx.table('user').insert({
        id: user_id,
        username: body.username,
        password: md5('123456'),
      });

      // 分配角色
      await tx.table('user_roles').insert({ user_id, role_id: '7ed939b06d7411e9967767de069f4a05' });

      // 创建商户
      const merchant = {
        id: uuid(),
        creater: curUser.id,
        audit_status: 'init',
        merchant_no: moment().format('YYYYMMDDHHmmSSSS') + Math.ceil(Math.random() * 100),
        merchant_name: body.merchant_name,
        user_id,
        secret_key: uuid(),
        liaisons: body.liaisons,
        tel: body.tel,
        email: body.email,
        qq: body.QQ,
        exchange_rate: body.exchange_rate,
        charging_method: 'Percentage',
        update_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await tx.table('merchant').insert(merchant);
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      return ResultUtils.badRequest(error.essage);
    }
    return ResultUtils.success();
  }

  @Post('/update')
  @ApiDescription('更新商户信息')
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
      .table('merchant')
      .where({ id })
      .update({ code, name });
    return ResultUtils.success();
  }

  @Post('/remove')
  @ApiDescription('删除商户')
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
        .table('user_merchants')
        .where({ merchant_id: id })
        .delete();
      await tx
        .table('merchant')
        .where({ id })
        .delete();
      await tx.commit();
    } catch (error) {
      await tx.rollback();
    }
    return ResultUtils.success();
  }

  @Post('/enable')
  @ApiDescription('启用商户')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async enable(@Body() body: any) {
    const id = body.id;
    await db
      .table('merchant')
      .where({ id })
      .update({ enable: 1 });
    return ResultUtils.success();
  }

  @Post('/disable')
  @ApiDescription('启用商户')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async disable(@Body() body: any) {
    const id = body.id;
    await db
      .table('merchant')
      .where({ id })
      .update({ enable: 0 });
    return ResultUtils.success();
  }

  @Post('/allow-draw-cash')
  @ApiDescription('允提现')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async allowDrawCash(@Body() body: any) {
    const id = body.id;
    await db
      .table('merchant')
      .where({ id })
      .update({ allow_draw_cash: 1 });
    return ResultUtils.success();
  }

  @Post('/not-allow-draw-cash')
  @ApiDescription('禁止体现')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async notAllowDrawCash(@Body() body: any) {
    const id = body.id;
    await db
      .table('merchant')
      .where({ id })
      .update({ allow_draw_cash: 0 });
    return ResultUtils.success();
  }

  @Post('/audit-pass')
  @ApiDescription('审核通过')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async auditPass(@Body() body: any) {
    const id = body.id;
    await db
      .table('merchant')
      .where({ id })
      .update({ audit_status: 'pass' });
    return ResultUtils.success();
  }

  @Post('/audit-fail')
  @ApiDescription('审核不通过')
  @BodySchame(
    joi.object({
      id: joi.string().required(),
    }),
  )
  async auditFail(@Body() body: any) {
    const id = body.id;
    await db
      .table('merchant')
      .where({ id })
      .update({ audit_status: 'fail' });
    return ResultUtils.success();
  }
}

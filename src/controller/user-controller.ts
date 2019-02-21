import { Controller, Get, Render, CronJob, QuerySchame, Query, Ctx } from 'souljs';
import * as joi from 'joi';
import * as Koa from 'koa';
import userService from '../user-service';
import { ResultUtils } from '../utils/result-utils';
import { sign } from '../middleware/app-jwt';
import getLogger from '../utils/log4js';

const logger = getLogger('user-controller');

@Controller('/user')
export default class User {
  @Get()
  @Render('index')
  async index(@Ctx() ctx: Koa.Context) {
    ctx.session.id = (ctx.session.id || 0) + 1;
    return { content: JSON.stringify(ctx.session) };
  }

  @CronJob('* * * * * *')
  cron() {
    logger.error(process.env.INSTANCE_ID);
  }

  @Get('/user_info')
  @QuerySchame(
    joi.object().keys({
      name: joi.string().required(),
    }),
  )
  async addUser(@Query() query: any) {
    const users = await userService.getUsers(query.name);
    return ResultUtils.success(users);
  }

  @Get('/login')
  @QuerySchame(
    joi.object().keys({
      name: joi.string().required(),
    }),
  )
  async login(@Ctx() ctx: Koa.Context, @Query() query: any) {
    const token = sign({ name: query.name });
    ctx.cookies.set('authorization', token, { httpOnly: true });
    return ResultUtils.success('ok', token);
  }
}

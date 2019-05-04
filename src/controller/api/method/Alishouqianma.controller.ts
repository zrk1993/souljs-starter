import { Controller, Get, QuerySchame, Query, Ctx, Post, BodySchame, Body, ApiDescription, Render } from 'souljs';
import * as joi from 'joi';
import * as Koa from 'koa';
import * as moment from 'moment';
import * as db from '../../../utils/db';

@Controller('/pay_alishouqianma')
export default class MethodController {
  @Post('/pay')
  async pay(@Query('order_no') order_no: string, @Ctx() ctx: Koa.Context) {
    const order = await db.table('order').where({ order_no }).find();

    if (order.close === 1) {
      return ctx.render('/pay/method/order_closed');
    }
  }
}

import { Controller, Get, QuerySchame, Query, Ctx, Post, BodySchame, Body, ApiDescription, Render } from 'souljs';
import * as joi from 'joi';
import * as Koa from 'koa';
import * as moment from 'moment';
import { ResultUtils } from '../../utils/result-utils';
import * as db from '../../utils/db';
import uuid from '../../utils/uuid';
import CurUser from '../../decorators/cur-user';
import md5 from '../../utils/md5';
import createSign from '../../utils/create-sign';

@Controller('/pay')
export default class PayController {
  @Post('/unifiedorder')
  @ApiDescription('统一下单')
  async unifiedorder(@Body() data: any) {
    const {
      mch_no, // 商户号
      out_trade_no, // 外部交易号
      trade_type, // 支付方式
      amount, // 支付金额
      sign, // 签名
    
      attach, // 附加数据，原样返回
      body, // 商品描述
      notify_url, // 异步通知地址
      return_url, // 同步通知地址
    } = data;

    if (!mch_no) return ResultUtils.badRequest('商户号不能为空！');
    if (!out_trade_no) return ResultUtils.badRequest('交易号不能为空！');
    if (!trade_type) return ResultUtils.badRequest('支付方式不能为空！');
    if (!amount) return ResultUtils.badRequest('支付金额不能为空！');
    if (isNaN(amount) || amount <= 0 || amount > 10000000) return ResultUtils.badRequest('支付金额错误！');

    const merchant = await db.table('merchant').where({ merchant_no: mch_no, enable: 1 }).findOrEmpty();
    if (!merchant) return ResultUtils.badRequest('商户不存在或不可用！');

    if (sign !== createSign({
      mch_no, out_trade_no, trade_type, amount, attach, body, notify_url, return_url
    }, merchant.secret_key)) return ResultUtils.badRequest('签名校验失败！');

    


    return Pay.orderquery(body);
  }

  @Post('/orderquery')
  @ApiDescription('查询订单')
  async orderquery(@Body() body: any) {
    return ResultUtils.success();
  }

  @Get('/charges/:mch_name')
  @ApiDescription('收银台')
  @Render('pay/charges')
  async charges() {}
}

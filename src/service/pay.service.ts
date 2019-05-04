/**
 * 统一下单
 */
interface IUnifiedorder {
  mch_no: string; // 商户号
  out_trade_no: string; // 外部交易号
  trade_type: string; // 支付方式
  amount: string; // 支付金额
  sign: string; // 签名

  attach?: string; // 附加数据，原样返回
  body?: string; // 商品描述
  notify_url?: string; // 异步通知地址
  return_url?: string; // 同步通知地址
}
export async function unifiedorder(params: IUnifiedorder) {}

/**
 * 查询订单
 */
export async function orderquery({ mch_no, out_trade_no, trade_type, total_fee, attach, sign }) {}

/**
 * 通知订单
 */
export async function notify({ mch_no, out_trade_no, trade_type, total_fee, attach, sign }) {}

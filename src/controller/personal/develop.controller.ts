import { Controller, Get, ApiDescription } from 'souljs';
import { ResultUtils } from '../../utils/result-utils';
import * as db from '../../utils/db';
import Role from '../../decorators/role';
import CurUser from '../../decorators/cur-user';
import { SYS_ROLE } from '../../../src/enums';

@Controller('/personal/develop')
@Role(SYS_ROLE.merchant)
export default class DevelopController {
  @Get('/secret')
  @ApiDescription('开发参数')
  async secret(@CurUser() curUser: any) {
    const merchant = await db
      .table('merchant')
      .where({ user_id: curUser.id })
      .find();
    return ResultUtils.success({
      merchantNo: merchant.merchant_no,
      secretKey: merchant.secret_key,
    });
  }
}

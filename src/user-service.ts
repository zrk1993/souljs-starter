import * as db from './utils/db';

class UserService {
  /**
   * 获取所有用户
   */
  async getUsers() {
    const sql = `
    SELECT U.*, B.*
    FROM t_user AS U
    LEFT JOIN pk_book_user AS BU ON U.user_id = BU.user_id
    LEFT JOIN t_book AS B ON B.book_id = BU.book_id`;

    const structure = {
      table: 'U',
      primary_key: 'user_id',
      includes: [{
        table: 'B',
        primary_key: 'book_id'
      }]
    };

    const results = await db.query({ sql, nestTables: true });
    return results;
  }
}

const userService = new UserService();
export default userService;

import * as db from './utils/db';
import reCartesian from './utils/re-cartesian';

class UserService {
  /**
   * 获取所有用户
   */
  async getUsers(name: string) {
    const sql = `
    SELECT U.*, B.*, BU.*
    FROM t_user AS U
    LEFT JOIN pk_book_user AS BU ON U.user_id = BU.user_id
    LEFT JOIN t_book AS B ON B.book_id = BU.book_id`;

    const results = await db.query({ sql, nestTables: true });

    const data = reCartesian(results, {
      table: 'U',
      id: 'user_id',
      hasOne: [
        {
          table: 'B',
          as: 'book',
          id: 'book_id',
        },
      ],
      hasMany: [
        {
          table: 'B',
          as: 'books',
          id: 'book_id',
        },
        {
          table: 'BU',
          as: 'bus',
          id: 'book_id',
        },
      ],
    });

    return data;
  }
}

const userService = new UserService();
export default userService;

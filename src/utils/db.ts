import * as mysql from 'mysql';
import getLogger from './log4js';

const logger = getLogger('db.ts');

export const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'Mysql@123qwer',
  database: 'souljs',
});

pool.on('error', error => {
  logger.error(error.message);
});

pool.query('SELECT 1', error => {
  if (error) {
    logger.error(error.message);
  } else {
    logger.info('mysql连接成功！');
  }
});

export async function query(options: string | mysql.QueryOptions, values?: any): Promise<any> {
  const opt = typeof options === 'string' ? { sql: options, values } : options;
  return new Promise((resolve, reject) => {
    pool.query(opt, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

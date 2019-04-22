import * as mysql from 'mysql';
import getLogger from './log4js';
import { QueryBuilder, Tx } from './orm';

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

async function getPoolConnection(): Promise<mysql.PoolConnection> {
  return new Promise((res, rej) => {
    pool.getConnection((err, connection) => {
      if (err) {
        rej(err);
      } else {
        res(connection);
      }
    });
  });
}

export function table(tb: string): QueryBuilder {
  return QueryBuilder.table(tb, { queryFunction: query });
}

export async function beginTx() {
  const conn = await getPoolConnection();

  await new Promise((resolve, reject) => {
    conn.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  return new Tx({
    query,
    commit: async () => {
      return new Promise((resolve, reject) => {
        conn.commit((err) => {
          conn.release();
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },
    rollback: async () => {
      return new Promise((resolve) => {
        conn.rollback(() => {
          conn.release();
          resolve();
        });
      });
    },
  });
}

import { Orm } from 'soul-orm';
import getLogger from './log4js';

const logger = getLogger('db.ts');

const orm = new Orm({
  connectionLimit: 10,
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'Mysql@123456',
  database: 'pay',
});

orm.setLogger(logger as any);

export default orm;

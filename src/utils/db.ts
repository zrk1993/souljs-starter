import { DBM } from 'soul-orm';
import getLogger from './log4js';

const logger = getLogger('db.ts');

const orm = new DBM({
  connectionLimit: 10,
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'Mysql@123456',
  database: 'soul',
  isDebug: false,
});

orm.setLogger(logger as any);

export default orm;

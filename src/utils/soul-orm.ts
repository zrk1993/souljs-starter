// const user = await db.table('user').where('id = :id', { id: 1 }).find();
// const user = await db.table('user').where('id = ?', [1]).find();

// const users = await db.table('user').where({ id: 1 }).select();
// const users = await db.table('user').where('id = :id', { id: 1 }).select();
// const users = await db.table('user').where('id = ?', [1]).select();

// const users = await db.table('user').where({ id: 1 }).field('id, name', 'ta as c').select();

// const users = await db.table('user').where('id = ?', [1]).limit(10, 10).select();

// const users = await db.table('user').where('id = ?', [1]).limit(10, 10).order('id', 'desc').select();

// const users = await db.table('user').where('id = ?', [1]).limit(10, 10).order('id', 'desc').select();

// await db.table('user').insert({ name: 1 });
// await db.table('user').insert([ { name: 1 }, { name: 1 }, { name: 1 } ]);

// await db.table('user').where('').update({ name: 1 });

// await db.table('user').where('').delete();

// const tx = await db.tx();
// await tx.table('user').where({ id: 1 }).find();
// await tx.table('user').where('').delete();
// await tx.commit();
// await tx.rollback();

import * as mysql from 'mysql';
import { number } from 'joi';

interface ITX {
  connection: mysql.Connection;
}

class Tx {
  private connection: mysql.Connection;

  constructor({ connection }) {
    this.connection = connection;
  }

  public static beginTx() {
    const connection = ;
    return new Tx({ connection })
  }

  table(tb: string): SoulOrm {
    return SoulOrm.table(tb, { connection: this.connection });
  }

  async commit() {
    await this.connection.commit();
  }

  async rollback() {
    await this.connection.rollback();
  }
}

class SoulOrm {

    private _table: string;
    private _field = '*';
    private _where: string;
    private _limit: number;
    private _offset: number;
    private _order: string;

    private _sql: string;

    private _connection: mysql.Connection;
    
    public static table(table: string, opt?: { connection: object }): SoulOrm {
      return new SoulOrm();
    }

    public static startTx() {
      return new SoulOrm();
    }
  
    public async select(): Promise<object[]> {
      
      this._sql = `SELECT ${this._field} FROM ${this._table} WHERE ${this._where}`;

      if (this._order) {
        this._sql += ` ORDER BY ${this._order}`;
      }

      if (this._limit) {
        this._sql += ` LIMIT ${this._limit}`;
        if (this._offset) {
          this._sql += `,${this._offset}`;
        }
      }
      const result: any = await this.exec();
      return result;
    }
  
    public find(): object {
      if (!this.limit) this._limit = 1;
      const result = await this.select();
      return result[0];
    }
  
    public insert(data: object): number
    public insert(data: object[]): void
    public insert(data: object | object[]): void | number {
      const insertData: any = data[0] ? data : [data];
      const colums = Object.keys(insertData[0]);
      const values = insertData.map((item) => {
        return `(${colums.map(c => item[c]).join(',')})`;
      });

      this._sql = `INSERT INTO ${this._table} (${colums.join(',')}) VALUES ${values.join(',')}`;
    }
  
    public update(data: object): void {
      const update = Object.keys(data).map(key => `${key}=${data[key]}`).join(',');
      this._sql = `UPDATE ${this._table} SET ${update} WHERE ${this._where}`;
      await this.exec();
    }
  
    public delete(): void {
      this._sql = `DELETE FROM ${this._table} WHERE ${this._where}`;
      await this.exec();
    }
  
    public where(where: object)
    public where(where: string, a?: [])
    public where(...wheres: any) {
      if (typeof wheres[0] === 'string') {

      } else {
        
      }
    }
  
    public limit(limit: number, offset?: number) {
      this._limit = limit;
      this._offset = offset;
    }
  
    public order(field: string, od: string) {
      this._order = `${field} ${od}`;
    }

    public field(...fields: string[]) {
      this._field = fields.join(',')
    }

    private getConnection() {}

    private async exec(): Promise<void | any[]> {
      if (!this._connection) {
        await this.getConnection();
      }

      const result: any = await this._connection.query(this._sql);
      return result;
    }
  }
  

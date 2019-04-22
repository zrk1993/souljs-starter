const user = await db.table('user').where('id = :id', { id: 1 }).find();
const user = await db.table('user').where('id = ?', [1]).find();

const users = await db.table('user').where({ id: 1 }).select();
const users = await db.table('user').where('id = :id', { id: 1 }).select();
const users = await db.table('user').where('id = ?', [1]).select();

const users = await db.table('user').where({ id: 1 }).field('id, name', 'ta as c').select();

const users = await db.table('user').where('id = ?', [1]).limit(10, 10).select();

const users = await db.table('user').where('id = ?', [1]).limit(10, 10).order('id', 'desc').select();

const users = await db.table('user').where('id = ?', [1]).limit(10, 10).order('id', 'desc').select();

await db.table('user').insert({ name: 1 });
await db.table('user').insert([ { name: 1 }, { name: 1 }, { name: 1 } ]);

await db.table('user').where('').update({ name: 1 });

await db.table('user').where('').delete();

const tx = await db.tx();
await tx.table('user').where({ id: 1 }).find();
await tx.table('user').where('').delete();
await tx.commit();
await tx.rollback();



class SoulOrm {

    private _table: string;
    private _field: string[];
    private _where: object[];
    private _limit: number;
    private _offset: number;
    private _page: number;
    private _orderField: string;
    
    public static table(table: string): SoulOrm {
      return new SoulOrm();
    }
  
    public select(): object[] {
      //
      return [];
    }
  
    public find(): object {
        return this.select()[0];
    }
  
    public insert(f: object): number
    public insert(d: object[])
    public insert(...params: any) {
      //
    }
  
    public update(da: object) {
      //
    }
  
    public delete() {
      //
    }
  
    public where(pa: object)
    public where(pa: string)
    public where(pa: string, a?: [])
    public where(pa: string, op: string, va: any)
    public where(...params: any) {

    }
  
    public limit(a: number, b?: number) {}
    public page(p: number = 1) {}
  
    public order(field: string, od: string) {}

    public field(...fields: string) {}
  }
  

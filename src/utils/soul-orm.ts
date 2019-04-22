
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
    public findOrFail(): object {
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
  

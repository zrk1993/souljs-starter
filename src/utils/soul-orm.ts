
class SoulOrm {

    private _table: string;
    private _field: string[];
    private _where: object[];
    private _data: object[];
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
  
    public insert()
    public insert(f: object)
    public insert(d: object[])
    public insert(...params: any) {
      //
    }
    public insertGetId(): number {
        return 1;
    }
  
    public update()
    public update(da: object)
    public update(...d: any) {
      //
    }
  
    public delete() {
      //
    }
  
    public where(pa: object)
    public where(pa: string)
    public where(pa: string, a: [])
    public where(pa: string, op: string, va: any)
    public where(...params: any) {

    }

    public whereOr(pa: object)
    public whereOr(pa: string)
    public whereOr(pa: string, a: [])
    public whereOr(pa: string, op: string, va: any)
    public whereOr(...params: any) {

    }
  
    public limit(a: number, b?: number) {}
    public page(p: number = 1) {}
  
    public order(field: string, od: string) {}
  
    public data(d: object)
    public data(d: object[]) {}

    public field(p: string)
    public field(...p: string[])
    public field(f: string[])
    public field(...a: any) {}

    public count(f?: string) {}
    public max(field: string) {}
    public min(field: string) {}
    public avg(field: string) {}
    public sum(field: string) {}
  }
  
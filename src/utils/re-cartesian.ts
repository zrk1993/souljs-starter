/**
 * mysql关联查询的结果，可能是个笛卡尔积的形式，这种数据格式并不友好。
 * 这是个辅助工具，来改变这种状况, 要配合{ nestTables: true }使用
 * 2019-02-13
 */

interface IStructure {
  table: string;
  id: string;
  as?: string;
  hasOne?: IStructure[];
  hasMany?: IStructure[];
}

/**
 * 反笛卡尔积
 * @param dataList sql查询结果集
 * @param structure 结构描述
 * @param results - 递归需要
 */
export default function reCartesian(dataList: any[], structure: IStructure, results: any[] = []): any[] {
  const keyMap = {};

  dataList.forEach(row => {
    const key = row[structure.table][structure.id];
    if (!keyMap[key]) {
      keyMap[key] = [];
      row[structure.table].groups = () => keyMap[key];
      results.push(row[structure.table]);
    }
    keyMap[key].push(row);
  });

  const recursion = (strus: IStructure[] = [], type: string) => {
    strus.forEach(stru => {
      results.forEach(row => {
        const data = reCartesian(row.groups(), stru);
        row[stru.as || stru.table] = type === 'many' ? data : data[0];
      });
    });
  };

  recursion(structure.hasMany, 'many');
  recursion(structure.hasOne, 'one');

  return results;
}

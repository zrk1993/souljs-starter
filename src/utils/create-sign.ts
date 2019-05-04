import md5 from '../utils/md5';

export default function createSign(data: any, key: string): string {
  const keys = Object.keys(data);
  keys.sort(); // 将所有字段按照ascii码排序
  const signStr = keys.map(key => `${key}=${data[key]}`).join('&');
  const sign = md5(signStr + '&key=' + key);
  return sign;
}
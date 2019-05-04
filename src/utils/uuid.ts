import * as uuid from 'uuid';

export default () => {
  return uuid.v1().replace(/-/gi, '');
};

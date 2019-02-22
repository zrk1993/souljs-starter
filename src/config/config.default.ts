import { NODE_ENV } from '../enums';

export const defaultConfig = {
  env: NODE_ENV.dev,
  port: 3001,
  qiniu: {
    ak: 'vvog3fXfvr_aqsjzo_nsiOuClcGZNAhSz7uXGOBS',
    sk: 'O9JZrMZ7uUMW5p7GaHrUnlkx075vj22b1VLSgYke',
    rtc: {
      appId: 'e11umo41j',
    },
  },
};

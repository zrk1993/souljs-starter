
import { createParamDecorator } from 'souljs';

const CurUser = createParamDecorator((ctx) => {
  return ctx.state.curUser;
});

export default CurUser;

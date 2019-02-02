import { Controller, Get, Render } from 'souljs';
import getLogger from './utils/log4js';

var logger = getLogger('main.ts');

@Controller()
export default class User {
  @Get()
  @Render('index')
  index() {
    return { content: logger };
  }
}

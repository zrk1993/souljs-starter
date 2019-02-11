import { Controller, Get, Render } from 'souljs';
import config from './config';

@Controller()
export default class User {
  @Get()
  @Render('index')
  index() {
    return { content: JSON.stringify(config) };
  }
}

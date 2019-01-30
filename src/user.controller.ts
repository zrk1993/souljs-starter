import { Controller, Get } from 'souljs';

@Controller('')
export default class User {
  @Get()
  index() {
    return { content: 'hi' };
  }
}

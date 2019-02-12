import { Controller, Get, Render, Post, QuerySchame, Query } from 'souljs';
import * as joi from 'joi';
import userService from './user-service';
import * as db from './utils/db';

@Controller('/user')
export default class User {
  @Get()
  async index() {
    const users = await userService.getUsers();
    return users;
  }

  @Post('/add_user')
  @QuerySchame(
    joi.object().keys({
      name: joi.string().required(),
    }),
  )
  async addUser(@Query() query: any) {
    const results = await db.query('INSERT INTO t_user (name) VALUES (?)', [query.name]);
    return results;
  }

  @Post('/add_book')
  @QuerySchame(
    joi.object().keys({
      book: joi.string().required(),
    }),
  )
  async addBook(@Query() query: any) {
    const results = await db.query('INSERT INTO t_book (book) VALUES (?)', [query.book]);
    return results;
  }

  @Post('/link')
  @QuerySchame(
    joi.object().keys({
      book_id: joi.number().required(),
      user_id: joi.number().required(),
    }),
  )
  async link(@Query() query: any) {
    const results = await db.query('INSERT INTO pk_book_user (book_id, user_id) VALUES (?, ?)', [
      query.book_id,
      query.user_id,
    ]);
    return results;
  }
}

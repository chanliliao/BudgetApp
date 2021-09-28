import { __prod__ } from './constants';
import { Account } from './entities/Account';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';

// this set up is for CLI
// using migrations
export default {
  migrations: {
    // it creates the absolute path
    path: path.join(__dirname, './migrations'),
    // [tj] this makes it accept ts and js files
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Account],
  dbName: 'budget_app',
  user: 'postgres',
  password: 'H119d201m611d215',
  type: 'postgresql',
  debug: !__prod__,
  // parameter return as arr and you can set the type by grabing the type that is expected
} as Parameters<typeof MikroORM.init>[0];

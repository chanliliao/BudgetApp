import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mircoConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import dotenv from 'dotenv';
import { AccResolver } from './resolvers/account';
import { HelloResolver } from './resolvers/hello';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

declare module 'express-session' {
  interface Session {
    accId: number;
  }
}

const main = async () => {
  // orm and db connection
  const orm = await MikroORM.init(mircoConfig);

  // auto run the migration function
  await orm.getMigrator().up();

  //set up enviroment files
  dotenv.config();

  // create server
  const app = express();

  // // connect redis and sessions
  // const RedisStore = connectRedis(session);
  // const redis = new Redis('127.0.0.1:6379');
  // app.set('trust proxy', 1);
  // app.use(
  //   session({
  //     // name of the session
  //     name: 'qid',
  //     // telling session we are using redis
  //     store: new RedisStore({
  //       client: redis,
  //       disableTouch: true,
  //     }),
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
  //       httpOnly: true,
  //       sameSite: 'lax', //csrf
  //       secure: __prod__, //cookie only works in https
  //     },
  //     saveUninitialized: false,
  //     secret: 'budget',
  //     resave: false,
  //   })
  // );

  // create a new apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, AccResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      em: orm.em,
      req,
      res,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // routes

  // set port
  const PORT = process.env.PORT || 5000;

  // let us know the server is running
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});

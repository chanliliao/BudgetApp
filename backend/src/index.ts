import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { COOKIE_NAME, __prod__ } from './constants';
import mircoConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import dotenv from 'dotenv';
import { AccResolver } from './resolvers/account';
import { HelloResolver } from './resolvers/hello';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { sendEmail } from './utils/sendEmail';
import { Account } from './entities/Account';

declare module 'express-session' {
  interface Session {
    accId: number;
  }
}

const main = async () => {
  // orm and db connection
  const orm = await MikroORM.init(mircoConfig);

  // clear all data from table
  // await orm.em.nativeDelete(Account, {})

  // auto run the migration function
  await orm.getMigrator().up();

  //set up enviroment files
  dotenv.config();

  // create server
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  // // connect redis and sessions
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
  });
  // app.set('trust proxy', 1);
  app.use(
    session({
      // name of the session
      name: COOKIE_NAME,
      // telling session we are using redis
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: __prod__, //cookie only works in https
      },
      saveUninitialized: false,
      secret: 'budget',
      resave: false,
    })
  );

  // create a new apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, AccResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

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

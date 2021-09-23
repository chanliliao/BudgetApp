import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mircoConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import dotenv from 'dotenv';

const main = async () => {
  // orm and db connection
  const orm = await MikroORM.init(mircoConfig);

  // auto run the migration function
  await orm.getMigrator().up();

  //set up enviroment files
  dotenv.config();

  // create server
  const app = express();

  // create a new apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [],
      validate: false,
    }),
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

import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { User } from './entities/User';
import mircoConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(mircoConfig);
  // auto run the migration function
  await orm.getMigrator().up();

  // create an instance of the user
  // const user = orm.em.create(User, {
  //   firstName: 'henry',
  //   lastName: 'liao',
  //   email: 'hl@gmail.com',
  // });

  // add the instace to db
  // await orm.em.persistAndFlush(user);
  const users = await orm.em.find(User, {});
  console.log(users);
};

main().catch((err) => {
  console.log(err);
});

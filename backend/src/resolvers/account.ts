import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Account } from '../entities/Account';
import { MyContext } from '../types';
import argon2 from 'argon2';
import { EntityManager } from '@mikro-orm/postgresql';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { EmailPasswordInput } from '../utils/EmailPasswordInput';
import { validateReg } from '../utils/validationReg';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';

// for returns
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class AccResponse {
  // if no user, return erros
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  // if there is user, return the acc
  @Field(() => Account, { nullable: true })
  acc?: Account;
}

@Resolver()
export class AccResolver {
  // Authencation
  @Query(() => Account, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.accId) {
      return null;
    }
    const acc = await em.findOne(Account, { _id: req.session.accId });
    return acc;
  }

  //Forgot password
  @Mutation(() => Boolean)
  async forgotPW(@Arg('email') email: string, @Ctx() { em, redis }: MyContext) {
    // validation
    const acc = await em.findOne(Account, { email: email });
    if (!acc) {
      // email does not exist
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      acc._id,
      'ex',
      1000 * 60 * 60
    );

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );
    return true;
  }

  // Register Acc
  @Mutation(() => AccResponse)
  async register(
    // @Arg('firstName') firstName: string,
    // @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<AccResponse> {
    // Validation
    const errors = validateReg(
      // firstName, lastName,
      email,
      password
    );
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(password);

    let acc;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(Account)
        .getKnexQuery()
        .insert({
          // first_name: firstName,
          // last_name: lastName,
          email: email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('*');
      acc = result[0];
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'email',
              message: 'Account exist',
            },
          ],
        };
      }
    }
    // set the session
    req.session.accId = acc._id;
    console.log(acc);
    return { acc };
  }
  // Login Acc
  @Mutation(() => AccResponse)
  async login(
    @Arg('options') options: EmailPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<AccResponse> {
    const acc = await em.findOne(Account, { email: options.email });
    if (!acc) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Email does not exist',
          },
        ],
      };
    }
    const valid = await argon2.verify(acc.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Password does not match',
          },
        ],
      };
    }

    // set the session
    req.session.accId = acc._id;

    return { acc };
  }
  // Logout
  @Mutation(() => Boolean)
  logout(@Ctx() { res, req }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }

  // UPDATE Acc
  // DEL Acc
  // GET all Accs
  // GET Acc by ID
}

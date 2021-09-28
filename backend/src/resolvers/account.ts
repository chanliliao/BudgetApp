import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Account } from '../entities/Account';
import { MyContext } from '../types';
import argon2 from 'argon2';

// for arguments
@InputType()
class EmailPasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

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
  @Query(() => Account, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.accId) {
      return null;
    }
    const acc = await em.findOne(Account, { _id: req.session.accId });
    return acc;
  }
  // Register Acc
  @Mutation(() => AccResponse)
  async register(
    @Arg('options') options: EmailPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<AccResponse> {
    // Validation
    if (options.email.length === 0) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Please input your email',
          },
        ],
      };
    }
    const valid = await em.findOne(Account, { email: options.email });
    if (valid) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Account exist',
          },
        ],
      };
    }

    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Length must be greater than 3',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const acc = em.create(Account, {
      email: options.email,
      password: hashedPassword,
    });
    await em.persistAndFlush(acc);

    // set the session
    req.session.accId = acc._id;

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
  // Login A

  // UPDATE Acc
  // DEL Acc
  // GET all Accs
  // GET Acc by ID
}

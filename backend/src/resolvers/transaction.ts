import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { MyContext } from '../types';
import { Transaction } from '../entities/Transaction';
import { validateTransaction } from '../utils/validationTransaction';

// for returns
@ObjectType()
class TransactionError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class TransactionResponse {
  // if no transaction, return errors
  @Field(() => [TransactionError], { nullable: true })
  errors?: TransactionError[];
  // if there is transaction, return the acc
  @Field(() => Transaction, { nullable: true })
  transaction?: Transaction;
}

@Resolver()
export class TransactionResolver {
  // Get all transactions
  @Query(() => [Transaction], { nullable: true })
  async getTransactions(@Ctx() { em }: MyContext): Promise<Transaction[]> {
    return em.find(Transaction, {});
  }

  // Get one transaction by ID
  @Query(() => Transaction, { nullable: true })
  async getTransactionByID(
    @Arg('id') _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Transaction | null> {
    return em.findOne(Transaction, { _id });
  }

  // Create transaction
  @Mutation(() => TransactionResponse)
  async createTransaction(
    @Arg('amount') amount: number,
    @Arg('description') description: string,
    @Ctx() { em }: MyContext
  ): Promise<TransactionResponse> {
    // let convertAmount = amount * 100;
    const errors = validateTransaction(
      // firstName, lastName,
      amount,
      description
    );
    if (errors) {
      return { errors };
    }
    const transaction = em.create(Transaction, {
      amount: amount,
      description: description,
    });
    await em.persistAndFlush(transaction);
    return { transaction };
  }

  //Update transaction by ID
  @Mutation(() => TransactionResponse)
  async UpdateTransaction(
    @Arg('id') _id: number,
    @Arg('amount', () => Number, { nullable: true }) amount: number,
    @Arg('description', () => String, { nullable: true }) description: string,
    @Ctx() { em }: MyContext
  ): Promise<TransactionResponse> {
    const transaction = await em.findOne(Transaction, { _id });
    if (!transaction) {
      return {
        errors: [
          {
            field: 'transaction',
            message: 'Transaction not found',
          },
        ],
      };
    }
    if (!amount) {
      transaction.amount = transaction.amount;
    } else {
      transaction.amount = amount;
    }
    if (!description) {
      transaction.description = transaction.description;
    } else {
      transaction.description = description;
    }
    em.persistAndFlush(transaction);
    return { transaction };
  }

  // Delete transaction
  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id') _id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(Transaction, { _id });
    return true;
  }
}

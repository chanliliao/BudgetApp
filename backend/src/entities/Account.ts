import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

// entity means a table
// This file sets up the format of the table
@ObjectType()
@Entity()
export class Account {
  @Field(() => Int)
  @PrimaryKey()
  _id!: number;

  // @Field(() => String)
  // @Property()
  // firstName!: string;

  // @Field(() => String)
  // @Property()
  // lastName!: string;

  @Field(() => String)
  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  // the type is how you change the datatype for migration
  @Field(() => String)
  @Property({ type: 'date' })
  createdAt: Date = new Date();

  // special hook that updates the date
  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();
}

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

// entity means a table
// This file sets up the format of the table
@Entity()
export class User {
  @PrimaryKey()
  _id!: number;

  // the type is how you change the datatype for migration
  @Property({ type: 'date' })
  createdAt: Date = new Date();

  // special hook that updates the date
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  email!: string;
}

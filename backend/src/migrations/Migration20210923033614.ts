import { Migration } from '@mikro-orm/migrations';

export class Migration20210923033614 extends Migration {
  // check how migration is creating the table
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null);'
    );

    this.addSql('drop table if exists "users" cascade;');
  }
}

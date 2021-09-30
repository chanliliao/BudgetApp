import { Migration } from '@mikro-orm/migrations';

export class Migration20210930075052 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "account" ("_id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "account" add constraint "account_email_unique" unique ("email");');
  }

}

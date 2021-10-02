import { Migration } from '@mikro-orm/migrations';

export class Migration20210930230613 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "transaction" ("_id" serial primary key, "amount" int4 not null, "description" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

}

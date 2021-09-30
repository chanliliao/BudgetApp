"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210930075052 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210930075052 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "account" ("_id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
        this.addSql('alter table "account" add constraint "account_email_unique" unique ("email");');
    }
}
exports.Migration20210930075052 = Migration20210930075052;
//# sourceMappingURL=Migration20210930075052.js.map
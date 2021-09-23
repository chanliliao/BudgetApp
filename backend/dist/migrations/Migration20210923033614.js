"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210923033614 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210923033614 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null);');
        this.addSql('drop table if exists "users" cascade;');
    }
}
exports.Migration20210923033614 = Migration20210923033614;
//# sourceMappingURL=Migration20210923033614.js.map
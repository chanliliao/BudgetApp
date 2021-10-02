"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210930230613 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210930230613 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "transaction" ("_id" serial primary key, "amount" int4 not null, "description" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    }
}
exports.Migration20210930230613 = Migration20210930230613;
//# sourceMappingURL=Migration20210930230613.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Transaction_1 = require("../entities/Transaction");
const validationTransaction_1 = require("../utils/validationTransaction");
let TransactionError = class TransactionError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TransactionError.prototype, "message", void 0);
TransactionError = __decorate([
    (0, type_graphql_1.ObjectType)()
], TransactionError);
let TransactionResponse = class TransactionResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [TransactionError], { nullable: true }),
    __metadata("design:type", Array)
], TransactionResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Transaction_1.Transaction, { nullable: true }),
    __metadata("design:type", Transaction_1.Transaction)
], TransactionResponse.prototype, "transaction", void 0);
TransactionResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], TransactionResponse);
let TransactionResolver = class TransactionResolver {
    async getTransactions({ em }) {
        return em.find(Transaction_1.Transaction, {});
    }
    async getTransactionByID(_id, { em }) {
        return em.findOne(Transaction_1.Transaction, { _id });
    }
    async createTransaction(amount, description, { em }) {
        const errors = (0, validationTransaction_1.validateTransaction)(amount, description);
        if (errors) {
            return { errors };
        }
        const transaction = em.create(Transaction_1.Transaction, {
            amount: amount,
            description: description,
        });
        await em.persistAndFlush(transaction);
        return { transaction };
    }
    async UpdateTransaction(_id, amount, description, { em }) {
        const transaction = await em.findOne(Transaction_1.Transaction, { _id });
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
        }
        else {
            transaction.amount = amount;
        }
        if (!description) {
            transaction.description = transaction.description;
        }
        else {
            transaction.description = description;
        }
        em.persistAndFlush(transaction);
        return { transaction };
    }
    async deleteTransaction(_id, { em }) {
        await em.nativeDelete(Transaction_1.Transaction, { _id });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Transaction_1.Transaction], { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "getTransactions", null);
__decorate([
    (0, type_graphql_1.Query)(() => Transaction_1.Transaction, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "getTransactionByID", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TransactionResponse),
    __param(0, (0, type_graphql_1.Arg)('amount')),
    __param(1, (0, type_graphql_1.Arg)('description')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "createTransaction", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TransactionResponse),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Arg)('amount', () => Number, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('description', () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "UpdateTransaction", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "deleteTransaction", null);
TransactionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TransactionResolver);
exports.TransactionResolver = TransactionResolver;
//# sourceMappingURL=transaction.js.map
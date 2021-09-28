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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Account_1 = require("../entities/Account");
const argon2_1 = __importDefault(require("argon2"));
let EmailPasswordInput = class EmailPasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], EmailPasswordInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], EmailPasswordInput.prototype, "password", void 0);
EmailPasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], EmailPasswordInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let AccResponse = class AccResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], AccResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Account_1.Account, { nullable: true }),
    __metadata("design:type", Account_1.Account)
], AccResponse.prototype, "acc", void 0);
AccResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], AccResponse);
let AccResolver = class AccResolver {
    async me({ req, em }) {
        if (!req.session.accId) {
            return null;
        }
        const acc = await em.findOne(Account_1.Account, { _id: req.session.accId });
        return acc;
    }
    async register(options, { em, req }) {
        if (options.email.length === 0) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: 'Please input your email',
                    },
                ],
            };
        }
        const valid = await em.findOne(Account_1.Account, { email: options.email });
        if (valid) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: 'Account exist',
                    },
                ],
            };
        }
        if (options.password.length <= 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Length must be greater than 3',
                    },
                ],
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const acc = em.create(Account_1.Account, {
            email: options.email,
            password: hashedPassword,
        });
        await em.persistAndFlush(acc);
        req.session.accId = acc._id;
        return { acc };
    }
    async login(options, { em, req }) {
        const acc = await em.findOne(Account_1.Account, { email: options.email });
        if (!acc) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: 'Email does not exist',
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(acc.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Password does not match',
                    },
                ],
            };
        }
        req.session.accId = acc._id;
        return { acc };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Account_1.Account, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AccResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmailPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], AccResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AccResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmailPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], AccResolver.prototype, "login", null);
AccResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AccResolver);
exports.AccResolver = AccResolver;
//# sourceMappingURL=account.js.map
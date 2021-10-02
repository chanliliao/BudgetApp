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
const constants_1 = require("../constants");
const EmailPasswordInput_1 = require("../utils/EmailPasswordInput");
const validationRegister_1 = require("../utils/validationRegister");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
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
    async changePassword(token, newPassword, { em, redis, req }) {
        if (newPassword.length <= 3) {
            return {
                errors: [
                    {
                        field: 'newPassword',
                        message: 'Length must be greater than 3',
                    },
                ],
            };
        }
        const key = constants_1.FORGET_PASSWORD_PREFIX + token;
        const accId = await redis.get(key);
        if (!accId) {
            return {
                errors: [{ field: 'token', message: 'token expired' }],
            };
        }
        const acc = await em.findOne(Account_1.Account, { _id: parseInt(accId) });
        if (!acc) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: 'User no longer exist',
                    },
                ],
            };
        }
        const hashedPassword = await argon2_1.default.hash(newPassword);
        acc.password = hashedPassword;
        await em.persistAndFlush(acc);
        await redis.del(key);
        req.session.accId = acc._id;
        return { acc };
    }
    async forgotPW(email, { em, redis }) {
        const acc = await em.findOne(Account_1.Account, { email: email });
        if (!acc) {
            return true;
        }
        const token = (0, uuid_1.v4)();
        await redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, acc._id, 'ex', 1000 * 60 * 60);
        await (0, sendEmail_1.sendEmail)(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
        return true;
    }
    async register(email, password, { em, req }) {
        const errors = (0, validationRegister_1.validateRegister)(email, password);
        if (errors) {
            return { errors };
        }
        const hashedPassword = await argon2_1.default.hash(password);
        let acc;
        try {
            const result = await em
                .createQueryBuilder(Account_1.Account)
                .getKnexQuery()
                .insert({
                email: email,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            })
                .returning('*');
            acc = result[0];
        }
        catch (err) {
            if (err.code === '23505') {
                return {
                    errors: [
                        {
                            field: 'email',
                            message: 'Account exist',
                        },
                    ],
                };
            }
        }
        req.session.accId = acc._id;
        console.log(acc);
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
    logout({ res, req }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            res.clearCookie(constants_1.COOKIE_NAME);
            resolve(true);
        }));
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
    __param(0, (0, type_graphql_1.Arg)('token')),
    __param(1, (0, type_graphql_1.Arg)('newPassword')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AccResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccResolver.prototype, "forgotPW", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AccResponse),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AccResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AccResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmailPasswordInput_1.EmailPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], AccResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccResolver.prototype, "logout", null);
AccResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AccResolver);
exports.AccResolver = AccResolver;
//# sourceMappingURL=account.js.map
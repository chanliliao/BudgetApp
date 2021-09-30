"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReg = void 0;
const validateReg = (options) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: 'email',
                message: 'Invalid email',
            },
        ];
    }
    if (options.password.length <= 3) {
        return [
            {
                field: 'password',
                message: 'Length must be greater than 3',
            },
        ];
    }
    return null;
};
exports.validateReg = validateReg;
//# sourceMappingURL=validationReg.js.map
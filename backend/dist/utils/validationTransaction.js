"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = void 0;
const validateTransaction = (amount, description) => {
    if (!amount) {
        return [
            {
                field: 'amount',
                message: 'Please input amount',
            },
        ];
    }
    if (!description) {
        return [
            {
                field: 'description',
                message: 'Please input a description',
            },
        ];
    }
    return null;
};
exports.validateTransaction = validateTransaction;
//# sourceMappingURL=validationTransaction.js.map
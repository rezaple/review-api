"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate = [
    express_validator_1.check('email').isString(),
    express_validator_1.check('password').isLength({ min: 6 }),
    (req, res, next) => {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }
        next();
    }
];
exports.default = validate;

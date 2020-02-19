"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class Authenticate {
}
Authenticate.hashPassword = (password) => {
    return bcrypt.hash(password, 10);
};
Authenticate.comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bcrypt.compare(password, hashedPassword);
    return result;
});
Authenticate.generateToken = ({ id, name, email }) => __awaiter(void 0, void 0, void 0, function* () {
    const secretKey = process.env.SECRET_KEY || 'secretKey';
    const token = yield jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: { id, name, email }
    }, secretKey);
    return token;
});
exports.default = Authenticate;

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
const BaseRoutes_1 = require("./BaseRoutes");
const Authenticate_1 = require("../utils/Authenticate");
const AuthValidator_1 = require("../middlewares/AuthValidator");
const models = require('../models/');
class AuthRouter extends BaseRoutes_1.default {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield models.User.findOne({
                where: { email }
            });
            if (user) {
                const isAuthenticate = yield Authenticate_1.default.comparePassword(password, user.password);
                if (isAuthenticate) {
                    const token = yield Authenticate_1.default.generateToken(user);
                    res.status(200).send({ token });
                }
            }
            return res.status(401).send({
                status: '401 Unauthenticated',
                message: 'Credentials not match in our data.'
            });
        });
    }
    routes() {
        this.router.post("/login", AuthValidator_1.default, this.login);
    }
}
exports.default = new AuthRouter().router;

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
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const BaseRoutes_1 = require("./BaseRoutes");
const models = require('../models/');
class UserRouter extends BaseRoutes_1.default {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.app.locals.credential.data;
            const user = yield models.User.findOne({
                where: { id },
                attributes: ['id', 'name', 'email', 'profile_picture']
            });
            return res.send({
                status: 200,
                data: user
            });
        });
    }
    test(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.send(req.body);
        });
    }
    routes() {
        this.router.get('/', AuthMiddleware_1.default, this.index);
        this.router.post('/test', this.test);
    }
}
const userRoutes = new UserRouter();
userRoutes.routes();
exports.default = userRoutes.router;

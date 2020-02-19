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
class AttachmentRouter extends BaseRoutes_1.default {
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.app.locals.credential.data;
            const { id } = req.params;
            try {
                const attach = yield models.Attachment.findOne({
                    where: { id },
                    include: [{
                            model: models.Review,
                            as: 'review',
                            required: true,
                            where: { user_id },
                            attributes: ['id', 'comment', 'rate', 'createdAt']
                        }],
                });
                if (!attach) {
                    throw {
                        code: 404,
                        name: 'NotFoundError',
                        message: 'Attachment Not Found'
                    };
                }
                const isdeleted = attach.destroy();
                return res.status(204).send('');
            }
            catch (e) {
                return res.status(e.code || 500).send({
                    status: e.code,
                    message: e.message
                });
            }
        });
    }
    routes() {
        this.router.delete('/:id', AuthMiddleware_1.default, this.destroy);
    }
}
const attachRoutes = new AttachmentRouter();
attachRoutes.routes();
exports.default = attachRoutes.router;

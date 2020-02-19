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
const ReviewValidator_1 = require("../middlewares/ReviewValidator");
const UploadMiddleware_1 = require("../middlewares/UploadMiddleware");
const models = require('../models/');
class ReviewRouter extends BaseRoutes_1.default {
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { id: user_id } = req.app.locals.credential.data;
            const review = yield models.Review.findOne({
                where: { id, user_id },
                include: [{
                        model: models.User,
                        as: 'user',
                        required: false,
                        attributes: ['name', 'email', 'profile_picture']
                    }, {
                        model: models.Attachment,
                        as: 'attachments',
                        required: false,
                        attributes: ['id', 'path']
                    }],
                attributes: ['id', 'comment', 'rate', 'createdAt']
            });
            if (!review) {
                return res.send({
                    status: 404,
                    message: 'Review Not Found'
                }).status(404);
            }
            return res.send({
                status: 200,
                data: review
            }).status(200);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.app.locals.credential.data;
            const { comment, rate } = req.body;
            const { id } = req.params;
            const files = req.files;
            try {
                const review = yield models.Review.findOne({
                    where: { id, user_id }
                });
                if (!review) {
                    throw {
                        code: 404,
                        name: 'NotFoundError',
                        message: 'Review Not Found'
                    };
                }
                const newData = yield review.update({
                    comment,
                    rate
                });
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        const path = files[i].path.replace('build/', '');
                        const type = files[i].mimetype;
                        const attach = yield models.Attachment.create({
                            review_id: review.id,
                            type,
                            path
                        });
                    }
                }
                return res.send({ statu: 200, data: newData }).status(200);
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.app.locals.credential.data;
            const { id } = req.params;
            try {
                const review = yield models.Review.findOne({
                    where: { id, user_id }
                });
                if (!review) {
                    throw {
                        code: 404,
                        name: 'NotFoundError',
                        message: 'Review Not Found'
                    };
                }
                const isdeleted = review.destroy();
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
        this.router.get('/:id', this.show);
        this.router.post('/:id/edit', AuthMiddleware_1.default, UploadMiddleware_1.uploadImage, ReviewValidator_1.default, this.update);
        this.router.delete('/:id', AuthMiddleware_1.default, this.destroy);
    }
}
const reviewRoutes = new ReviewRouter();
reviewRoutes.routes();
exports.default = reviewRoutes.router;

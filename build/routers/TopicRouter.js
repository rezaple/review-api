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
class TopicRouter extends BaseRoutes_1.default {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const topics = yield models.Topic.findAll({
                attributes: ['id', 'name', 'description']
            });
            return res.send({
                status: 200,
                data: topics
            }).status(200);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const topic = yield models.Topic.findOne({
                where: { id },
                include: [{
                        model: models.Review,
                        as: 'reviews',
                        required: false,
                        attributes: ['id', 'comment', 'rate', 'createdAt'],
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
                    }],
                attributes: ['id', 'name', 'description']
            });
            if (!topic) {
                return res.send({
                    status: 404,
                    message: 'Topic Not Found'
                }).status(404);
            }
            return res.send({
                status: 200,
                data: topic
            }).status(200);
        });
    }
    storeReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.app.locals.credential.data;
            const { comment, rate } = req.body;
            const { id: topic_id } = req.params;
            const files = req.files;
            const topic = yield models.Topic.findOne({
                where: { id: topic_id }
            });
            if (!topic) {
                return res.send({
                    status: 404,
                    message: 'Topic tidak ditemukan.'
                }).status(404);
            }
            const hasReviewedTopic = yield models.Review.findOne({
                where: { topic_id, user_id }
            });
            if (hasReviewedTopic) {
                return res.send({
                    status: 400,
                    message: 'Maaf Anda sudah memberikan review untuk topic ini.'
                }).status(400);
            }
            const review = yield models.Review.create({
                topic_id,
                user_id,
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
            return res.send(review).status(201);
        });
    }
    routes() {
        this.router.get('/', this.index);
        this.router.get('/:id', this.show);
        //remove validate
        this.router.post('/:id/review', AuthMiddleware_1.default, UploadMiddleware_1.uploadImage, ReviewValidator_1.default, this.storeReview);
    }
}
const topicRoutes = new TopicRouter();
topicRoutes.routes();
exports.default = topicRoutes.router;

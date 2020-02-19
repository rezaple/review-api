"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
// import router
const UserRouter_1 = require("./routers/UserRouter");
const AuthRouter_1 = require("./routers/AuthRouter");
const TopicRouter_1 = require("./routers/TopicRouter");
const ReviewRouter_1 = require("./routers/ReviewRouter");
const AttachmentRouter_1 = require("./routers/AttachmentRouter");
// server class
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.use('/uploads', express.static(path.join(__dirname + '/uploads')));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(helmet());
        this.app.use(logger('dev'));
        this.app.use(compression());
        this.app.use(cors());
    }
    routes() {
        this.app.route('/').get((req, res) => {
            res.status(200).json('Review Topic REST API');
        });
        this.app.use('/auth', AuthRouter_1.default);
        this.app.use('/users', UserRouter_1.default);
        this.app.use('/topics', TopicRouter_1.default);
        this.app.use('/reviews', ReviewRouter_1.default);
        this.app.use('/attachments', AttachmentRouter_1.default);
    }
}
exports.default = new Server().app;

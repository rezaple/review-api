"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class BaseRoutes {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
}
exports.default = BaseRoutes;

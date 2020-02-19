"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const helper_1 = require("../utils/helper");
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './build/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const uploadImage = multer({
    storage: storage,
    fileFilter: helper_1.imageFilter
}).array('photos', 2);
exports.uploadImage = uploadImage;

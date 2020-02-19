import * as multer from 'multer';
import { imageFilter } from '../utils/helper';

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './build/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+'-'+file.originalname);
    }
});

const uploadImage = multer({
    storage: storage,
    fileFilter: imageFilter
}).array('photos', 2)

export { uploadImage };
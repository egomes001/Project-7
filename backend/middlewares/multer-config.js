const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ 
    destination: (request, file, callback) => {
        callback(null, 'images')
    },
    filename: (request, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
 });

 const upload = multer({ storage }).single('image');

 const compressImage = (request, response, next) => {
    if (!request.file) {
        return next();
    }

    sharp(request.file.path)
        .resize(200)
        .toBuffer((error, buffer) => {
            if (error) {
                return next(error);
            }
            sharp(buffer)
                .toFile(request.file.path, (err, info) => {
                    if (err) {
                        return next(err);
                    }
                    next();
                });
        });
};

module.exports = { upload, compressImage };
require("dotenv").config();

import crypto from 'crypto';
const aws = require('aws-sdk')
const multerS3 = require('multer-s3');
let hashed = crypto.randomBytes(12).toString('hex');
let time = new Date();
let now = Date.now();

export default {
    storage: multerS3({
        s3: new aws.S3(),
        bucket: 'ipet-uploads',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req: any, file: any, callback: any) => {
            const fileName = `${hashed}-${now}-${file.originalname}`;

            callback(null, fileName)
        },
    }),

    hashed: `${hashed}`,
    time: `${now}`


} 
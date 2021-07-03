const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const url = "https://s3.amazonaws.com";
const bucketName = "imgboardbucket";

// "https://s3.amazonaws.com/:yourBucketName/:filename";

// console.log("(file_upload.js) multer: ", multer.diskStorage);
// console.log("(file_upload.js) __dirname: ", __dirname);
// console.log("(file_upload.js) __dirname: ", path.join(__dirname, "uploads"));

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),

    filename: function (request, file, callback) {
        uidSafe(24).then(function (uid) {
            // console.log(
            //     "...(file_upload.js) file extension: ",
            //     path.extname(file.originalname)
            // );
            request.body.url = path.join(
                url,
                bucketName,
                uid + path.extname(file.originalname)
            );

            // console.log("...(file_upload.js) URL: ", request.body.url);
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        filesize: 2097152,
    },
});
console.log("(uploader): ", uploader);

const exporting = {
    uploader,
};

module.exports = exporting;

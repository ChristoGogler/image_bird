const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const url = "https://s3.amazonaws.com";
const bucketName = "imgboardbucket";

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),

    filename: function (request, file, callback) {
        uidSafe(24).then(function (uid) {
            request.body.url = path.join(
                url,
                bucketName,
                uid + path.extname(file.originalname)
            );
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
// console.log("(uploader): ", uploader);

const exporting = {
    uploader,
};

module.exports = exporting;

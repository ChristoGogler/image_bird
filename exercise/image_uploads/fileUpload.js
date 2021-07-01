const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

console.log("multer: ", multer.diskStorage);

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, "uploads"),
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
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

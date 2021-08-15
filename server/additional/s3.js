const aws = require("aws-sdk");
const fs = require("fs");

let s3;
if (process.env.accessKeyID) {
    s3 = new aws.S3({
        accessKeyId: process.env.accessKeyID,
        secretAccessKey: process.env.secretAccessKey,
    });
} else {
    const secrets = require("../secrets.json");
    s3 = new aws.S3({
        accessKeyId: secrets.accessKeyID,
        secretAccessKey: secrets.secretAccessKey,
    });
}

const uploadFiles3 = (request, response, next) => {
    if (!request.file) {
        console.log("No request.file!");
        return response.sendStatus(500);
    }
    const { filename, mimetype, size, path } = request.file;

    s3.putObject({
        Bucket: "imgboardbucket",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then((result) => {
            if (result.ETag) {
                console.log(request.file.path);
                fs.unlink(request.file.path, (error) => {
                    console.log(error);
                });
                console.log("UPLOAD TO AWS S3 successful: ", result);
            }

            next();
        })
        .catch((error) => {
            console.log(error);
            response.sendStatus(500);
        });
};

const exporting = {
    uploadFiles3,
};

module.exports = exporting;

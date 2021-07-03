const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}
// console.log("(s3.js) secrets: ", secrets);
const s3 = new aws.S3({
    accessKeyId: secrets.accessKeyIDd,
    secretAccessKey: secrets.secretAccessKey,
});

const uploadFiles3 = (request, response, next) => {
    // console.log("...(uploadFiles3) s3: ", s3.accessKeyId, s3.secretAccessKey);

    // console.log("...(uploadFiles3) request.file: ", request.file);
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
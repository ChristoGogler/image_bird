const express = require("express");
const { getImages, saveImage } = require("./db");
const path = require("path");
const { uploader } = require("./file_upload");
const { uploadFiles3 } = require("./s3");
const app = express();
const PORT = 9090;

// console.log(__dirname, "/public");
// console.log(path.resolve(__dirname + "public"));
// console.log(path.join(__dirname, "public"));

app.use(express.static(path.join(__dirname, "public")))
    .use(express.static(path.join(__dirname, "uploads")))

    .use(express.urlencoded({ extended: false }))

    .get("/api/images.json", (request, response) => {
        console.log("(GET /api/images.json)");
        getImages()
            .then((images) => {
                response.json(images);
            })
            .catch((error) => {
                console.log("Error getting images from db: ", error);
            });
    })
    .get("/", (request, response) => {
        console.log("(GET /)");
        console.log("(Request): ", request);
    })

    .post(
        "/api/upload",
        uploader.single("picture"),
        uploadFiles3,
        saveToDb,
        (request, response) => {
            console.log("...(POST /api/upload) request.file: )", request.file);
            // console.log("...(POST /api/upload)) response: ", response);
            const latestImage = request.latestImage;
            response.json(latestImage);
            return;
        }
    )

    .listen(PORT, () => console.log(`...listening on PORT ${PORT}`));

function saveToDb(request, response, next) {
    console.log("...(server saveToDb)");
    // console.log("...(server saveToDb response", response);
    console.log("...(saveToDb) request body: ", request.body);
    saveImage(request.body).then((result) => {
        console.log("...(saveToDb) result: ", result);
        request.latestImage = result;
        next();
    });
}

const express = require("express");
const {
    getCommentsByImgId,
    getImages,
    getImageById,
    saveComment,
    saveImage,
} = require("./db");
const path = require("path");
const { uploader } = require("./file_upload");
const { uploadFiles3 } = require("./s3");
const app = express();
const PORT = 9090;

app.use(express.static(path.join(__dirname, "public")))
    .use(express.static(path.join(__dirname, "uploads")))

    .use(express.urlencoded({ extended: false }))
    .use(express.json())

    // Homepage
    // .get("/", (request, response) => {
    //     console.log("(GET /)");
    //     console.log("(Request): ", request);
    //     response.redirect("/");
    // })
    //GET /api/images.json
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
    //GET /api/images/:imageid
    .get("/api/images/:imageid", (request, response) => {
        console.log("(GET /api/images/:imageid)");
        const { imageid: imageId } = request.params;
        console.log("(imageid): ", imageId);
        getImageById(imageId)
            .then((image) => {
                console.log("...(getImageById) result: ", image[0]);
                response.json(image[0]);
            })
            .catch((error) => {
                console.log("Error getting image from db: ", error);
            });
    })
    //GET /api/images/:imageid/comments
    .get("/api/images/:imageid/comments", (request, response) => {
        console.log("(GET /api/images/:imageid/comments)");
        const { imageid: imageId } = request.params;
        console.log("(imageid): ", imageId);
        getCommentsByImgId(imageId)
            .then((comments) => {
                console.log("...(getCommentsByImgId) result: ", comments);
                response.json(comments);
            })
            .catch((error) => {
                console.log("Error getting image from db: ", error);
            });
    })
    //POST /api/images/:imageid/comments
    .post("/api/images/:imageid/comments", (request, response) => {
        console.log("(POST /api/images/:imageid/comments)");
        const { imageid: imageId } = request.params;
        console.log("Request Body: ", request.body);
        saveComment({ imageId, ...request.body })
            .then((comment) => {
                console.log("...(saveComment) result: ", comment);
                response.json(comment);
            })
            .catch((error) => {
                console.log("Error getting image from db: ", error);
            });
    })
    //POST /api/upload
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

    //PORT listen
    .listen(PORT, () => console.log(`...listening on PORT ${PORT}`));

//saveToDb
//middleware
function saveToDb(request, response, next) {
    console.log("...(server saveToDb)");
    // console.log("...(saveToDb) request body: ", request.body);
    saveImage(request.body).then((result) => {
        console.log("...(saveToDb) result: ", result);
        request.latestImage = result;
        next();
    });
}

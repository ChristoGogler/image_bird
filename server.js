const express = require("express");
const { getImages } = require("./db");
const path = require("path");
const app = express();
const PORT = 9090;

app.use(express.static(path.join(__dirname + "/public")))
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
    .listen(PORT, () => console.log(`...listening on PORT ${PORT}`));

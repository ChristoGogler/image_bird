const express = require("express");
const app = express();
const path = require("path");
const { uploader, diskStorage } = require("./fileUpload");

app.use(express.static(path.join(__dirname, "uploads")))
    .use(express.urlencoded({ extended: false }))
    .get("/uploads", (request, response) => {
        response.send(
            `<!doctype html>
    <html>
    <form enctype="multipart/form-data" action="/api/upload" method="POST">
        <input id="description" type="text" name="description">
        <input id="picture" type="file" accept="image/*" name="picture" required>
        <button type="submit">Upload</button>
    </form>
    <script src="/js/axios.min.js"></script>
    <script src="/js/upload-example.js"></script>
    </html>`
        );
    })

    .post("/api/upload", uploader.single("picture"), (request, response) => {
        console.log("request.body, request.file", request.body, request.file);
        if (request.file) {
            response.json({ ...request.file, ...request.body, success: true });
            return;
        }
        response.json({
            sucess: false,
        });
    })

    .listen(8080, () => console.log("listening..."));

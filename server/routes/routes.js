const express = require("express");
const router = express.Router();

const { uploader } = require("../additional/file_upload");
const { uploadFiles3 } = require("../additional/s3");

const {
    getAllImages,
    getSingleImageById,
    getCommentsByImageId,
    postComment,
    postImage,
} = require("../middlewares/routesHandler");

//ROUTES
router.get("/all", getAllImages);

router.get("/:imageid", getSingleImageById);

router.get("/:imageid/comments", getCommentsByImageId);

router.post("/:imageid/savecomment", postComment);

router.post(
    "/uploadnewimage",
    uploader.single("picture"),
    uploadFiles3,
    postImage
);

module.exports = router;

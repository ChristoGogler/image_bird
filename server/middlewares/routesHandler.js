const {
    getCommentsByImgId,
    getImages,
    getImageById,
    saveComment,
    saveImage,
} = require("../database/db_queries");

const getAllImages = (request, response) => {
    getImages(request.query)
        .then((images) => {
            response.json(images);
        })
        .catch((error) => {
            console.log("Error getting images from db: ", error);
        });
};

const getSingleImageById = (request, response) => {
    const { imageid: imageId } = request.params;
    getImageById(imageId)
        .then((image) => {
            response.json(image[0]);
        })
        .catch((error) => {
            console.log("Error getting image from db: ", error);
        });
};

const getCommentsByImageId = (request, response) => {
    const { imageid: imageId } = request.params;
    getCommentsByImgId(imageId)
        .then((comments) => {
            response.json(comments);
        })
        .catch((error) => {
            console.log("Error getting comment from db: ", error);
        });
};

const postComment = (request, response) => {
    const { imageid: imageId } = request.params;
    saveComment({ imageId, ...request.body })
        .then((comment) => {
            response.json(comment);
        })
        .catch((error) => {
            console.log("Error saving comment: ", error);
        });
};

const postImage = (request, response) => {
    saveImage(request.body).then((latestImage) => {
        response.json(latestImage);
        return;
    });
};

module.exports = {
    getAllImages,
    getSingleImageById,
    getCommentsByImageId,
    postComment,
    postImage,
};

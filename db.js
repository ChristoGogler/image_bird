const spicedPg = require("spiced-pg");
const user = process.env.user || require("./secrets.json").user;
const pwd = process.env.pwd || require("./secrets.json").pwd;
let postgresDb;
const exporting = {
    getCommentsByImgId,
    getImages,
    getImageById,
    saveComment,
    saveImage,
};

module.exports = exporting;
const setupDb = () => {
    const database = process.env.DB || "imageboard";

    if (process.env.DATABASE_URL) {
        console.log("(if): ", process.env.DATABASE_URL);
        postgresDb = spicedPg(process.env.DATABASE_URL);
    } else {
        console.log("(else): ", user, pwd, database);
        postgresDb = spicedPg(
            `postgres:${user}:${pwd}@localhost:5432/${database}`
        );
    }
    console.log(`Connecting to ${database}...!`);
};
setupDb();

function getCommentsByImgId(imgId) {
    console.log("...(getCommentsByImgId)");
    return postgresDb
        .query("SELECT * FROM comments WHERE img_id = $1", [imgId])
        .then((result) => {
            console.log("(query results)", result.rows);
            return result.rows;
        });
}

function getImages() {
    console.log("...(getImages)");
    return postgresDb
        .query("SELECT * FROM images ORDER BY id DESC")
        .then((result) => {
            console.log("(query results)", result.rows);
            return result.rows;
        });
}

function saveImage({ title, description, username, url }) {
    return postgresDb
        .query(
            "INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, username, url]
        )
        .then((result) => {
            console.log("...(saveImage) query result: ", result.rows);
            return result.rows;
        });
}

function saveComment({ imageId, username, comment }) {
    console.log(
        "...(saveComment) username, comment, img_id: ",
        username,
        comment,
        imageId
    );
    return postgresDb
        .query(
            "INSERT INTO comments (username, comment, img_id) VALUES ($1, $2, $3) RETURNING *",
            [username, comment, imageId]
        )
        .then((result) => {
            console.log("...(saveComment) query result: ", result.rows[0]);
            return result.rows[0];
        });
}

function getImageById(id) {
    console.log("...(getImageById)");
    return postgresDb
        .query("SELECT * FROM images WHERE id = $1", [id])
        .then((result) => {
            console.log("(query results)", result.rows);
            return result.rows;
        });
}

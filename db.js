const spicedPg = require("spiced-pg");
const moment = require("moment");
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
            changeDateToTimepast(result);
            console.log("(query results)", result.rows);
            return result.rows;
        });
}

function changeDateToTimepast(result) {
    result.rows.forEach((comment) => {
        comment.created_at = moment(comment.created_at).fromNow();
        console.log(comment.created_at);
    });
}

function getImages({ last_id, limit }) {
    console.log("...(getImages)");
    if (last_id) {
        return postgresDb
            .query(
                "SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT $2",
                [last_id, limit]
            )
            .then((result) => {
                console.log("(query results)", result.rows);
                return result.rows;
            });
    } else {
        return postgresDb
            .query("SELECT * FROM images ORDER BY id DESC LIMIT $1", [limit])
            .then((result) => {
                console.log("(query results)", result.rows);
                return result.rows;
            });
    }
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

const spicedPg = require("spiced-pg");
const user = process.env.user || require("./secrets.json").user;
const pwd = process.env.pwd || require("./secrets.json").pwd;
let postgresDb;
const exporting = {
    getImages,
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
function getImages() {
    console.log("...(getImages)");
    return postgresDb.query("SELECT * FROM images").then((result) => {
        console.log("(query results)", result.rows);
        return result.rows;
    });
}

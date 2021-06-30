const spicedPg = require("spiced-pg");
const user = process.env.user || require("./secrets.json").user;
const pwd = process.env.pwd || require("./secrets.json").pwd;

const exporting = {
    getImages,
};

module.exports = exporting;

const database = process.env.DB || "imageboard";
let postgresDb;
if (process.env.DATABASE_URL) {
    postgresDb = spicedPg(process.env.DATABASE_URL);
} else {
    spicedPg(`postgres:${user}:${pwd}@localhost:5432/${database}`);
}
console.log(`Connecting to ${database}...!`);

function getImages() {
    console.log("...(getImages)");
    return postgresDb.query("SELECT * FROM images").then((result) => {
        return result.rows;
    });
}

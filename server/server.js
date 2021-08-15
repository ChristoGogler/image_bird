const express = require("express");
const router = require("./routes/routes");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/images", router);

app.listen(PORT, () => console.log(`...listening on PORT ${PORT}`));

const express = require("express");
const app = express();
const router = require("./controllers/routes");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const session = require("express-session");

const flash = require("express-flash");

const connectDB = require("./database/connection");
dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 4000;
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());
app.use(express.static(path.join(__dirname, "assets")));
app.use(morgan("tiny"));
app.use("/", require("./controllers/routes"));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/plugins", express.static(path.resolve(__dirname, "assets/plugins")));
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/media", express.static(path.resolve(__dirname, "assets/media")));
app.set("view engine", "ejs");
connectDB();

app.listen(4000, () => {
  console.log(`Server running on ${PORT}`);
});

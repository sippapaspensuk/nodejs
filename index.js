const express = require("express");
require("dotenv").config({ path: ".env." + process.env.NODE_ENV });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const indexRoute = require("./routes/index");
const error = require("./middleware/error");
const notFound = require("./middleware/notFound");

app.use("/", indexRoute);

app.use(notFound);
app.use(error);

app.listen(process.env.PORT, () => console.log("Server started"));

require("dotenv").config();
const express = require("express");
const connection = require("./configs/connection");
const config = require("./configs/config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dayjs = require("dayjs");
const cors = require("cors");
const app = express();
const allRoutes = require("./routes/api");
const handleErrors = require("./middlewares/HandleException");
const { RequestMethods } = require("./middlewares/acceptRequestMethods");

app.use(cookieParser());
app.use(bodyParser.json());

// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = [
  "http://localhost:3000",
  "https://rightbox.herokuapp.com",
  "https://rightbox.herokuapp.com/",
];

const options = {
  origin: allowedOrigins,
  optionSuccessStatus: 200,
};
app.use(express.urlencoded({ extended: false }));
app.use(cors(options));
app.use("/api", allRoutes);
app.use((err, req, res, next) => {
  res
    .status(err.statusCode)
    .send({ statusCode: err.statusCode, status: 1, message: err.message });
});
app.use("/cookies", (req, res) => {
  const dataToSecure = {
    dataToSecure: "This is the secret data in the cookie.",
  };

  res.cookie("secureCookie", JSON.stringify(dataToSecure), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: dayjs()
      .add(30, "days")
      .toDate(),
  });

  res.send("Hello.");
});
// GET

// handling for wrong endpoint get request
app.get("*", (req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Oops, Something went wrong. Kindly check your endpoint"));
  });
});
// handling for wrong endpoint post request
app.post("*", (req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Oops, Something went wrong. Kindly check your endpoint"));
  });
});

// setting an environment  || port number
const PORT = process.env.PORT || config.PORT;
// middlewares
app.use(handleErrors);

// This will manage our sessions
// app.use(sessionHandler)
app.use(RequestMethods);

// telling our application which port to listen from.
app.listen(PORT, (req, res, next) => {
  console.log(`${config.Envoirnment} server is running at port ${PORT}`);
});

module.exports = app;

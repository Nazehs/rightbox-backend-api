require("dotenv").config();
require("newrelic");
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

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  "http://localhost:3000",
  "https://rightbox.herokuapp.com",
  "https://rightbox-web-bgjx.vercel.app",
  "https://rightbox-web-bgjx-l3z7d04xg-nazehs.vercel.app",
  "https://rightbox-web-bgjx-8bwox6jqs-nazehs.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api", allRoutes);

app.use("/cookies", (req, res) => {
  const dataToSecure = {
    dataToSecure: "This is the secret data in the cookie.",
  };

  res.cookie("secureCookie", JSON.stringify(dataToSecure), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: dayjs().add(30, "days").toDate(),
  });

  res.send("Hello.");
});

// GET

// Handling for wrong endpoint get request
app.get("*", (req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Oops, Something went wrong. Kindly check your endpoint"));
  });
});

// Handling for wrong endpoint post request
app.post("*", (req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error("Oops, Something went wrong. Kindly check your endpoint"));
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
});

// Setting the environment || port number
const PORT = process.env.PORT || config.PORT;

// Telling our application which port to listen to.
app.listen(PORT, () => {
  console.log(`${config.Environment} server is running at port ${PORT}`);
});

module.exports = app;

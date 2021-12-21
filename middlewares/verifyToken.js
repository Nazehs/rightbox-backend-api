const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const queryHelper = require("../helpers/queryHelper");
const { createAccessToken, refreshAccessToken } = require("./token");
const { NotFound, BadRequest } = require("../utils/GeneralErrors");

async function verifyToken(req, res, next) {
  try {
    const bearerHeader = await req.headers["authorization"];
    // var errObj = "";
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");

      if (
        bearer[0] == "bearer" ||
        (bearer[0] == "Bearer" && bearer[1] && bearer[1].length > 0)
      ) {
        const bearerToken = bearer[1];
        req.token = bearerToken;
      } else {
        req.token = "";
      }

      jwt.verify(req.token, config.ACCESS_TOKEN_SECRET, (error, authData) => {
        console.log(`token verification ${authData}`);

        if (error) {
          // throw new Error( "Session timed out,please login");
          console.error(`Error captured %%%%  ${error}`);
          if (error.name === "TokenExpiredError") {
            console.error(
              `Error captured %%%%   Session timed out,please login again`
            );
            next(new BadRequest("Session timed out,please login again"));
          } else if (error.name === "JsonWebTokenError") {
            next(new BadRequest("Invalid token,please login again!"));
          } else {
            console.error(error);
            next(new BadRequest("Oops,Pls try again an error has occured!"));
          }
        } else {
          let number = "";
          if (req.body && req.body["mobileNumber"]) {
            number = req.body["mobileNumber"];
          }

          let { userId } = authData;
          if (authData && userId) {
            getSessionStatus(req, res, next);
          } else {
            next(new BadRequest("Unauthorised user, you dont have access"));
          }
        }
      });
    } else {
      next(new BadRequest("Unauthorised user"));
    }
  } catch (error) {
    console.error(`Error has occured! ${error}`);
    next(new BadRequest("Oops, an error occured!"));
  }
}

async function generateRefreshToken(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      next(new NotFound("Access denied,token missing!"));
    } else {
      //query for the token to check if it is valid:
      const tokenDoc = await queryHelper.getUserSession(
        req.body.mobileNumber,
        token
      );

      const { refreshToken } = tokenDoc;
      //send error if no token found:
      if (!tokenDoc) {
        return res.status(401).json({ error: "Token expired!" });
      } else {
        jwt.verify(
          refreshToken,
          config.REFRESH_TOKEN_SECRET,
          async (error, authData) => {
            const accessToken = createAccessToken(req.body.mobileNumber);

            // generate refreshtoken
            const newRefreshToken = refreshAccessToken(req.body.mobileNumber);

            // make and entry for the session on the database
            let responseDoc = await queryHelper.updateToken(
              req.body.mobileNumber,
              accessToken,
              newRefreshToken,
              refreshToken
            );

            return res.status(200).json({ token: accessToken });
          }
        );
      }
    }
  } catch (error) {
    next(new BadRequest("Internal Server Error!"));
  }
}

var updateSessionStatus = async function(
  userId,
  session_id,
  message,
  req,
  res,
  next
) {
  var isTokenExpired = true;
  if (message == config.SESSION_CLEARED) {
    isTokenExpired = false;
  }

  var respObj = "";
  try {
    let sessionUpdate = await queryHelper.updateSessionStatus(
      userId,
      session_id,
      message,
      isTokenExpired
    );
    if (sessionUpdate) {
      next();
    } else {
      respObj = { message: message, status: 1 };
      res.send(respObj).status(200);
    }
  } catch (e) {
    console.error({ message: e.message, status: 401 });
    next(new BadRequest("Oops, an error has occured!"));
  }
};
var getSessionStatus = async function(req, res, next) {
  var session_id = req.token;
  var userId;
  if (req.body && req.body["mobileNumber"]) {
    userId = req.body["mobileNumber"];
  }
  var current_date = new Date();
  try {
    let getSession = await queryHelper.getUserSession(userId, session_id);
    let state = true;
    var timeDiff = "";
    var min = "";
    var respObj = "";
    if (getSession) {
      if (getSession.isSessionValid) {
        let updatedTime = getSession.currentDate;
        timeDiff = current_date.getTime() - new Date(updatedTime).getTime();
        min = Math.abs(Math.round(timeDiff / 60000));
        console.log(min);

        if (min >= config.IDLE_TIMEOUT) {
          state = false;
        }
        if (state) {
          try {
            updateSessionStatus(
              userId,
              session_id,
              config.VALID_SESSION,
              req,
              res,
              next
            );
          } catch (e) {
            respObj = { message: e.message, status: 401 };
            res.send(respObj).status(400);
          }
        } else {
          respObj = { message: "Session Timed Out", status: 401 };
          updateSessionStatus(
            userId,
            session_id,
            config.SESSION_CLEARED,
            req,
            res,
            next
          );
          res.send(respObj).status(400);
        }
      } else {
        next(new BadRequest("Unauthorised user, you dont have access"));
      }
    } else {
      next(new NotFound("Session Not Found"));
    }
  } catch (e) {
    respObj = { message: e.message, status: 401 };
    console.error(respObj);
    next(new BadRequest("Oops, an error has occured"));
  }
};

module.exports = { verifyToken, generateRefreshToken };

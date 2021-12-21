const { sign } = require("jsonwebtoken");
const config = require("./../configs/config");

const createAccessToken = (userId) => {
  try {
    return sign({ userId }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: `${config.IDLE_TIMEOUT * 60}s`,
    });
  } catch (error) {
    console.error(`token error ${error}`);
  }
};

const createAccessTwitterToken = (userId) => {
  try {
    return sign({ userId }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: `${config.IDLE_TIMEOUT * 60}s`,
    });
  } catch (error) {
    console.error(`token error ${error}`);
  }
};

const refreshAccessToken = (userId) => {
  try {
    return sign({ userId }, config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  } catch (error) {
    console.error(`token error ${error}`);
  }
};

const sendRefreshToken = (res, refreshtoken) => {
  try {
    res.cookie("refreshToken", refreshtoken, {
      secure: true,
      httpOnly: true,
    });
  } catch (error) {
    console.error(`token error ${error}`);
  }
};

const sendValidResponse = (req, res, data, accessToken) => {
  res.json({
    userInfo: data,
    token: accessToken,
    success: true,
    status: 0,
  });
};

module.exports = {
  refreshAccessToken,
  createAccessTwitterToken,
  createAccessToken,
  sendRefreshToken,
  sendValidResponse,
};

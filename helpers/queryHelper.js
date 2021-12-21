let query;
let userRequest;
let userSession;
let cardboard;
const config = require("../configs/config");
const { NotFound, BadRequest } = require("../utils/GeneralErrors");
class Queries {
  // connect to db
  /**
   * @param  {} conn connection instance
   */
  /**
   * @param  {} conn
   */
  static async injectDB(conn) {
    if (userRequest || userSession || cardboard) {
      return;
    }
    try {
      userRequest = await conn.db(config.MD_RIGHTBOX_DB).collection("users");
      userSession = await conn.db(config.MD_RIGHTBOX_DB).collection("sessions");
      cardboard = await conn.db(config.MD_RIGHTBOX_DB).collection("cardboards");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in user collection: ${e}`
      );
    }
    /**
     * @param  {} email string user email
     * @param  {} password string user password
     */
  }
  static async queryDBForUSer(email, password) {
    // query = queryDBUSer;
    const resultDoc = await query.findOne({ email: email, password: password });
    return resultDoc;
  }

  /**
   * @param  {} imagepath -- image path in cloudinary
   * @param  {} userNumber  --- userID which unique
   */
  static async updateImagePath(imagepath, userNumber) {
    let responses = await userRequest.findOneAndUpdate(
      { mobileNumber: userNumber },
      { $set: { imgUrl: imagepath } }
    );
    return responses;
  }
  /**
   * @param  {} userId userID is unique for each user
   * @param  {} sessionID active session ID of the user
   */
  static async getUserSession(userId, sessionID) {
    let respObj = "";
    try {
      let responses = await userSession.findOne({ sessionID, userId });
      return responses;
    } catch (error) {
      respObj = { message: error.message, status: 401 };
      return respObj;
    }
  }
  /**
   * @param  {} userId unique user iD
   * @param  {} sessionID unique session ID of the user
   * @param  {} message message passed from the caller
   * @param  {} isTokenExpired is boolean
   */
  static async updateSessionStatus(userId, sessionID, message, isTokenExpired) {
    var current_date = new Date();

    try {
      let responses = await userSession.findOneAndUpdate(
        { sessionID, userId },
        {
          $set: {
            updatedAt: current_date,
            sessionID,
            isSessionValid: isTokenExpired,
          },
        }
      );

      return responses;
    } catch (e) {
      respObj = { message: e.message, status: 401 };
      return respObj;
    }
  }

  /**
   * @param  {} userId  unique userID
   * @param  {} sessionID session ID of the user in query
   * @param  {} newRefreshToken the new refresh token generated
   * @param  {} oldRefreshToken - old refresh token of the user
   */
  static async updateToken(
    userId,
    sessionID,
    newRefreshToken,
    oldRefreshToken
  ) {
    var current_date = new Date();
    console.log(userId, sessionID, newRefreshToken, oldRefreshToken);

    try {
      let responses = await userSession.findOneAndUpdate(
        { refreshToken: oldRefreshToken, userId },
        {
          $set: {
            updatedAt: current_date,
            sessionID,
            refreshToken: newRefreshToken,
          },
        }
      );
      return responses;
    } catch (e) {
      let respObj = { message: e.message, status: 401 };
      return respObj;
    }
  }
  /**
   * @param  {} accessToken access token to be added
   * @param  {} refreshToken refresh token of the user
   * @param  {} userId  userID
   */
  static async addSession(accessToken, refreshToken, userId) {
    let respObj;

    var current_date = new Date();

    try {
      respObj = await userSession.insertOne({
        sessionID: accessToken,
        refreshToken,
        currentDate: current_date,
        userId,
        isSessionValid: true,
      });

      return respObj;
    } catch (error) {
      respObj = { message: error.message, status: 401 };
      return respObj;
    }
  }

  /**
   * @param  {} accessToken access token
   * @param  {} refreshToken refresh token
   */

  static async deleteSession(accessToken, refreshToken) {
    let respObj;

    try {
      respObj = await userSession.findOneAndDelete({
        sessionID: accessToken,
        refreshToken,
      });

      return respObj;
    } catch (error) {
      respObj = { message: error.message, status: 401 };
      return respObj;
    }
  }
  /**
   * @param  {} username unique ID to check in this case is mobilenumber
   */
  static async checkUserExist(username) {
    return await userRequest.find({ mobileNumber: username }).toArray();
  }

  static async queryAllCardboards(pageSize = 10, skip = 0) {
    return cardboard
      .aggregate([
        {
          $facet: {
            results: [{ $skip: skip }, { $limit: pageSize }],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ])
      .toArray();
  }
}
module.exports = Queries;

const cryto = require("crypto");
const config = require("../configs/config");
const query = require("../helpers/queryHelper");
const { NotFound, BadRequest } = require("../utils/GeneralErrors");
const {
  createAccessToken,
  refreshAccessToken,
  sendRefreshToken,
  sendValidResponse,
} = require("./../middlewares/token");
const queries = require("../helpers/queryHelper");
let userRequest;
let userSession;

// CREATE ACCOUNT FOR userRequest
class UserController {
  // connect to db
  /**
   * @param  {} conn connection instance
   */

  static async injectDB(conn) {
    if (userRequest || userSession) {
      return;
    }
    try {
      userRequest = await conn.db(config.MD_RIGHTBOX_DB).collection("users");
      userSession = await conn.db(config.MD_RIGHTBOX_DB).collection("sessions");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in user collection: ${e}`
      );
    }
  }

  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async createAccount(request, response, next) {
    try {
      request.body.password = !request.body.password
        ? "admin"
        : request.body.password;

      const hash = cryto
        .createHmac("sha256", config.tokenKey)
        .update(request.body.password.toLowerCase())
        .digest("hex");
      request.body.password = hash;
      console.log(
        `Request received:::::::::::::::::${JSON.stringify(request.body)}`
      );
      let checkDoc = await query.checkUserExist(request.body.mobileNumber);

      console.log(
        `check response %%%%%%  ${JSON.stringify(checkDoc)} %%%%%%%%`
      );
      if (checkDoc.length > 0) {
        console.error({
          message: "user already exist...",
          created: false,
          status: 1,
        });

        next(new BadRequest("Oops, user already exist..."));
      } else {
        userRequest
          .insertOne(request.body)
          .then((res) => {
            response.status(201).send({
              message: res.ops,
              created: true,
              status: 0,
            });
          })
          .catch((next) => {
            // log the error
            console.error(next.errmsg);
            var { errmsg } = next;
            if (errmsg.includes("E11000")) {
              console.error({
                message: next.errmsg,
                created: false,
                status: 1,
              });
              next(new BadRequest("Oops, there is a duplicates"));
            } else {
              console.error({
                message: next.errmsg,
                created: false,
                status: 1,
              });
              next(new BadRequest("Oops, try again"));
            }
          });
      }
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error occured!"));
    }
  }

  // DELETE AN ACCOUNT
  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async deleteAccount(request, response, next) {
    let doc = await userRequest.deleteMany({
      mobileNumber: { $in: [request.params.mobileNumber] },
    });
    console.log(`${JSON.stringify(doc)} was deleted successfully`);
    if (doc.deletedCount !== 0) {
      response.status(204).send({
        deleted: true,
        status: 0,
      });
    } else {
      next(new BadRequest("Oops, an error occured!"));
    }
  }

  // UPDATE userRequest ACCOUNT
  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async updateAccount(request, response, next) {
    var email = request.body.email;
    let doc;
    if (request.body.password) {
      const hash = cryto
        .createHmac("sha256", config.tokenKey)
        .update(request.body.password.toLowerCase())
        .digest("hex");

      request.body.password = hash;
      var pass = request.body.password.toLowerCase();
      doc = await userRequest.findOneAndUpdate(
        { email: email, password: pass },
        { $set: { password: request.body.password } }
      );
    } else {
      doc = await userRequest.findOneAndUpdate(
        { email: email, mobileNumber: request.params.userNumber },
        { $set: request.body }
      );
    }
    if (doc.lastErrorObject.updatedExisting) {
      response.status(200).send({
        message: doc.value,
        updated: true,
        status: 0,
      });
    } else {
      next(new NotFound("user not found"));
    }
  }

  //  QUERY  ALL USERS
  /**
   * @param  {} _request
   * @param  {} response
   */
  static async getAllUsers(_request, response) {
    try {
      const doc = await userRequest
        .aggregate([
          {
            $lookup: {
              from: "servicerequests",
              localField: "email",
              foreignField: "requester",
              as: "count",
            },
          },
        ])
        .toArray();

      response.status(200).json({ message: doc, status: 0, success: true });
    } catch (error) {
      console.log(
        ` there was an ${error} for ${JSON.stringify(_request.body)}`
      );
    }
  }
  /**
   * @param  {} request
   * @param  {} response
   */
  static async login(request, response, next) {
    request.body.username = request.body.username.toLowerCase();
    let username = request.body.username.toLowerCase();
    let password = request.body.password.toLowerCase();

    try {
      const hashpass = cryto
        .createHmac("sha256", config.tokenKey)
        .update(request.body.password.toLowerCase())
        .digest("hex");
      let doc = await userRequest
        .find({ email: username, password: hashpass })
        .toArray();
      if (doc === null || doc === undefined || doc.length === 0) {
        console.error({
          message: "Invalid credentials, pls try again",
          success: false,
          status: 1,
        });
        next(new BadRequest("Invalid credentials, pls try again"));
        // response.status(500).send({ message: 'Ooops!', status: 1 })
      } else {
        doc = doc[0];
        if (username && password) {
          let dbemail = doc.email;
          let dbpass = doc.password;
          if (username === dbemail && hashpass === dbpass) {
            // generate the access token
            const accessToken = createAccessToken(request.body.username);

            // generate refreshtoken
            const refreshToken = refreshAccessToken(request.body.username);

            // make and entry for the session on the database
            await query.addSession(
              accessToken,
              refreshToken,
              request.body.username
            );

            //send the refresh token
            sendRefreshToken(response, refreshToken);

            // send a valid response
            sendValidResponse(request, response, doc, accessToken);
          } else {
            console.error({
              message: "Invalid credentials, pls try again",
              success: false,
              status: 1,
            });
            response.status(500).send({ message: "Ooops!", status: 1 });
            next(new BadRequest("Invalid credentials, pls try again"));
          }
        }
      }
    } catch (error) {
      console.error({
        message: `${error.message} has occurred for ${JSON.stringify(
          request.body
        )}`,
        success: false,
        status: 1,
      });
      next(new BadRequest("Invalid credentials, pls try again"));
    }
  }

  /**
   * @param  {} _request
   * @param  {} response
   * @param  {} next
   */
  static async deleteAllAccounts(_request, response, next) {
    userRequest.deleteMany({}).then((res) => {
      response
        .status(200)
        .send({
          deleted: true,
          response: res,
        })
        .catch((error) => {
          console.error(
            `${error.message} has occurred for ${JSON.stringify(_request.body)}`
          );
          next(new BadRequest("Oops, an error has occurred"));
        });
    });
  }
  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async getUserDetails(request, response, next) {
    try {
      let doc = await userRequest
        .find({ mobileNumber: request.params.mobileNumber.trim() })
        .toArray();
      console.log(`request sent for  ${JSON.stringify(request.body)}`);
      if (doc.length > 0) {
        response.status(200).send({
          success: true,
          status: 0,
          message: doc,
        });
      } else {
        console.error(`has occurred for ${JSON.stringify(request.body)}`);
        next(new NotFound("Oops, user does not exist"));
      }
    } catch (error) {
      console.error(
        `${error} has occurred for ${JSON.stringify(request.body)}`
      );
      // console.log(error);
      // next(new NotFound("Oops, an error has occurred"))
    }
  }

  static async uploadImage(request, response) {
    try {
      if (request.file && request.file.path) {
        // console.log(request.file.path);
        await query.updateImagePath(
          request.file.path,
          request.params.userNumber
        );
        // console.log(request.file.path);
        return response
          .status(200)
          .json({ message: "image successfully saved" });
      } else {
        // console.log(req.file);
        return response.status(422).json({ error: "invalid" });
      }
    } catch (error) {
      // console.error(error);
      return response.status(500).json({ error: "some error occured" });
    }
  }
  static async logout(req, res, next) {
    try {
      res.clearCookie("refreshToken", { path: "/refresh_token" });
      res.send({
        message: "logout succefully",
        status: 0,
      });
    } catch (error) {
      console.log({
        message: "logout failed",
        status: 2,
      });
      next(new BadRequest("logout failed"));
    }
  }

  static async getAllUser(req, res, next) {
    try {
      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      //   const queries = new Queries();

      const users = await queries.queryAllUsers(limit, skip);

      return res.status(200).json(users);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }
}

module.exports = UserController;

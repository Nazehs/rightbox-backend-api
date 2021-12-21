const cryto = require("crypto");
const config = require("../configs/config");
const controller = require("../helpers/trasactions");
const query = require("../helpers/queryHelper");
const {
  createAccessToken,
  refreshAccessToken,
  sendRefreshToken,
  sendValidResponse,
} = require("../middlewares/token");
const { NotFound, BadRequest } = require("../utils/GeneralErrors");

let contanctus;

// CREATE ACCOUNT FOR userRequest
class ContactMessageController {
  // connect to db
  /**
   * @param  {} conn connection instance
   */
  static async injectDB(conn) {
    if (contanctus) {
      return;
    }
    try {
      contanctus = await conn
        .db(process.env.MD_RIGHTBOX_DB)
        .collection("contactus");
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
  static async createContactMessage(request, response, next) {
    try {
      request.body.appointmentID = Math.floor(
        Math.random() * 100000000
      ).toString();
      contanctus
        .insertOne(request.body)
        .then((res) => {
          response.status(201).send({
            message: res.ops,
            success: true,
            status: 0,
          });
        })
        .catch((error) => {
          let { errmsg } = error;
          console.log(error);

          next(new BadRequest("Oops, try again"));
        });
    } catch (error) {
      console.log(error);
      console.error(error);

      next(new BadRequest("Oops, an error occured!"));
    }
  }

  // DELETE AND ACCOUNT
  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async deleteContactmessage(request, response, next) {
    let doc = await contanctus.deleteMany({
      appointmentID: { $in: [request.params.appointmentID] },
    });
    console.log(`${JSON.stringify(doc)} was deleted successfully`);
    if (doc.deletedCount != 0) {
      response.status(204).send({
        success: true,
        status: 0,
      });
    } else {
      next(new BadRequest("Oops, an error occured!"));
    }
  }

  /**
   * @param  {} _request
   * @param  {} response
   */
  static async getAllContactMessages(request, response, next) {
    try {
      const doc = await contanctus.find({}).toArray();

      response.status(200).json({ message: doc, status: 0, success: true });
    } catch (error) {
      console.log(
        ` there was an ${error} for ${JSON.stringify(_request.body)}`
      );
      next(new BadRequest("Oops, an error has occurred"));
    }
  }

  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async getContactMessage(request, response, next) {
    try {
      console.log(request.params.appointmentID);
      let doc = await contanctus.findOne({
        appointmentID: request.params.appointmentID.trim(),
      });
      console.log(doc);
      if (doc) {
        response.status(200).send({
          success: true,
          status: 0,
          message: doc,
        });
      } else {
        console.error({
          message: `an error has occurred for ${JSON.stringify(
            request.params
          )}`,
          success: false,
          status: 1,
        });
        next(new NotFound("Oops, record does not exist"));
      }
    } catch (error) {
      console.error({
        message: `${error.message} has occurred for ${JSON.stringify(
          request.body
        )}`,
        success: false,
        status: 1,
      });
      next(new NotFound("Oops, an error has occurred"));
    }
  }
}

module.exports = ContactMessageController;

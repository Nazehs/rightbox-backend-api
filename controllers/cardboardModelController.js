const { NotFound, BadRequest } = require("../utils/GeneralErrors");
const queries = require("../helpers/queryHelper");
let cardboardRequest;

// CREATE ACCOUNT FOR userRequest
class CardBoardModelController {
  // connect to db
  /**
   * @param  {} conn connection instance
   */

  static async injectDB(conn) {
    if (cardboardRequest) {
      return;
    }
    try {
      cardboardRequest = await conn
        .db(process.env.MD_RIGHTBOX_DB)
        .collection("cardboards");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in cardboard collection: ${e}`
      );
    }
  }

  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async createCardboard(request, response, next) {
    try {
      cardboardRequest
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

          next(new BadRequest("Oops, an error occurred"));
        });
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
  static async deleteCardBoard(request, response, next) {
    const { code } = request.params;
    let doc = await cardboardRequest.removeOne({ code });

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
  static async updateCardBoard(request, response, next) {
    try {
      const { code } = request.params;
      let doc = await cardboardRequest.findOneAndUpdate(
        { code },
        { $set: { ...request.body } }
      );

      response
        .status(200)
        .send({ status: 0, success: true, message: doc.message.value });
    } catch (error) {
      next(new BadRequest("Oops, an error occured!"));
    }
  }

  static async getCardBoardByCode(request, response, next) {
    try {
      const { code } = request.params;
      let doc = await cardboardRequest.findOne({ code: code.trim() });
      if (doc) {
        response.status(200).send({
          success: true,
          status: 0,
          data: doc,
        });
      } else {
        next(new NotFound("Oops, invalid cardboard ID"));
      }
    } catch (error) {
      next(new NotFound("Oops, an error has occurred"));
    }
  }

  //  QUERY  ALL USERS
  /**
   * @param  {} _request
   * @param  {} response
   */
  static async getAll(_request, response) {
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
   * @param  {} _request
   * @param  {} response
   * @param  {} next
   */
  static async deleteAllCarboards(_request, response, next) {
    cardboardRequest.deleteMany({}).then((res) => {
      response
        .status(200)
        .send({
          deleted: true,
          response: res,
        })
        .catch((error) => {
          next(new BadRequest("Oops, an error has occurred"));
          console.log(error);
        });
    });
  }
  /**
   * @param  {} request
   * @param  {} response
   * @param  {} next
   */
  static async getCardBoardDetails(request, response, next) {
    try {
      const { code } = request.params;
      let doc = await cardboardRequest.findOne({ code: code.trim() });
      if (doc) {
        response.status(200).send({
          success: true,
          status: 0,
          data: doc,
        });
      } else {
        next(new NotFound("Oops, invalid cardboard ID"));
      }
    } catch (error) {
      next(new NotFound("Oops, an error has occurred"));
    }
  }

  static async getAllCardBoard(req, res, next) {
    try {
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = parseInt(req.query.skip) || 0;
      //   const queries = new Queries();

      let cardboards = await queries.queryAllCardboards(pageSize, skip);
      if (cardboards.length > 0) {
        cardboards = cardboards[0];
        cardboards.pageCount =
          Math.round(cardboards?.totalCount[0]?.count / pageSize) + 1;

        return res.status(200).json(cardboards);
      }
      // cardboards.pageSize = cardboards.
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 1,
        success: false,
        message: "Oops! an error occurred!",
      });
    }
  }
}

module.exports = CardBoardModelController;

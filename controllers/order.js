const { request } = require("express");

const config = require("../configs/config");
const { NotFound, BadRequest } = require("../utils/GeneralErrors");
let orderIstance;

class OrderManagement {
  // connect to db
  /**
   * @param  {} conn connection instance
   */
  static async injectDB(conn) {
    if (orderIstance) {
      return;
    }
    try {
      orderIstance = await conn
        .db(process.env.MD_RIGHTBOX_DB)
        .collection("orders");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in order  collection: ${e}`
      );
    }
  }
  /**
   * @param  {} req
   * @param  {} res
   */
  static async createOrder(req, res, next) {
    try {
      orderIstance.insertOne(req.body).then((doc) => {
        res.status(201).send({
          status: 0,
          success: true,
          message: doc.ops[0],
        });
      });
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error has occurred!"));
    }
  }
  /**
   * @param  {} req
   * @param  {} res
   */
  static async updateOrder(req, res, next) {
    try {
      let doc = await orderIstance.findOneAndUpdate(
        { owner: req.body.username, orderNumber: req.params.orderNumber },
        { $set: req.body }
      );

      res.send({ status: 0, message: doc.value, success: true });
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error has occurred!"));
    }
  }
  /**
   * @param  {} req
   * @param  {} res
   */
  static async getSingleOrder(req, res, next) {
    try {
      let doc = await orderIstance.findOne({
        orderNumber: req.params.orderNumber,
      });

      res.send({ status: 0, message: doc, success: true });
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error has occurred!"));
    }
  }
  /**
   * @param  {} req
   * @param  {} res
   */
  static async getUserOrders(req, res, next) {
    try {
      let doc = await orderIstance
        .find({ owner: req.params.mobileNumber })
        .toArray();

      res.send({ status: 0, message: doc, success: true });
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error has occurred!"));
    }
  }

  /**
   * @param  {} req
   * @param  {} res
   */
  static async deleteOrders(req, res, next) {
    try {
      let doc = await orderIstance.deleteOne({
        orderNumber: req.params.orderNumber,
      });
      res.send({
        status: 0,
        success: true,
        deletedCount: doc.deletedCount,
      });
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error has occurred!"));
    }
  }
  /**
   * @param  {} req
   * @param  {} res
   */
  static async getAllOrders(req, res, next) {
    try {
      let doc = await orderIstance.find({}).toArray();

      res.send({
        status: 0,
        deletedCount: doc.deletedCount,
        success: true,
      });
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error has occurred!"));
    }
  }
  /**
   * @param  {} req
   * @param  {} res
   */
  static async deleteAllOrders(req, res, next) {
    try {
      let doc = await orderIstance.deleteMany({});
      res.send({ status: 0, success: true, deletedCount: doc.deletedCount });
    } catch (error) {
      console.error(error);
      next(new BadRequest("Oops, an error has occurred!"));
    }
  }
}
module.exports = OrderManagement;

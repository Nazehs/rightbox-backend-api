const config = require("../configs/config");

let serviceRequest;

class TransactionHelper {
  static async injectDB(conn) {
    if (serviceRequest) {
      return;
    }
    try {
      //
      serviceRequest = await conn
        .db(config.MD_RIGHTBOX_DB)
        .collection("servicerequests");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in servicerequest: ${e}`
      );
    }
  }

  /**
   * 
   *@param {object} params - object fields coming from the frontend

   * @param {Number} serviceRequestNumber - unique transaction number
   */
  static async logServiceRequest(params, serviceRequestNumber) {
    try {
      params.serviceRequestNumber = serviceRequestNumber;

      const serviceDoc = await serviceRequest.insertOne(params);

      return serviceDoc.ops[0];
    } catch (e) {
      console.error(`${e} error occurred while creating service request!`);

      return { error: e };
    }
  }

  /**
   * 
   *@param {object} params - object fields coming from the frontend

   * @param {Number} serviceRequestNumber - unique transaction number
   */
  static async logOtherServiceRequest(params, serviceRequestNumber, action) {
    try {
      // const {params}  =  params;
      // console.log(params);

      params.transactionDate = new Date();
      params.serviceRequestNumber = serviceRequestNumber;
      params.action = action;

      let serviceDoc = await serviceRequest.insertOne(params);

      // return serviceDoc.ops[0];
    } catch (e) {
      console.error(`${e} error occurred while creating service request!`);
      return { error: e };
    }
  }

  /**
   *  update service request
   * @param {string} serviceRequestNumber  the service request number to be updated
   * @param {string} status  the new status to be updated with
   */
  static async updateServiceRequest(serviceRequestNumber, status) {
    try {
      const updateDoc = await serviceRequest.updateOne(
        { serviceRequestNumber: serviceRequestNumber },
        {
          $set: { serviceRequestStatus: status },
        }
      );
      return updateDoc;
    } catch (error) {
      console.error(`unble to update service request ${serviceRequestNumber}`);
      return { error: error };
    }
  }
}

module.exports = TransactionHelper;

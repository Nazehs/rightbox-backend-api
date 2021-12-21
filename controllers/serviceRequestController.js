const { BadRequest } = require("../utils/GeneralErrors");

// CREATE A SERVICE REQUEST
exports.createServiceRequest = (request, response, next) => {
  serviceRequest
    .create(request.body)
    .then((res) => {
      response.status(200).send({
        message: res,
        success: true,
      });
    })
    .catch((error) => {
      console.error(error);
      next(new BadRequest("Oops, an error has occured!"));
    });
};

// DELETE A SERVICE REQUEST
exports.deleteServiceRequest = (request, response, next) => {
  serviceRequest
    .findByIdAndRemove({ _id: request.params._id })
    .then((res) => {
      response.status(200).send({
        message: res,
        success: true,
      });
    })
    .catch((error) => {
      console.error(error);
      next(new BadRequest("Oops, an error has occured!"));
    });
};

// UPDATE A SERVICE REQUEST
exports.updateServiceRequest = (request, response, next) => {
  serviceRequest
    .findOneAndUpdate(
      {
        _id: request.params._id,
        serviceRequestNumber: request.params.serviceRequestNumber,
      },
      request.body
    )
    .then(() => {
      serviceRequest
        .find({ _id: request.params._id })
        .then((res) => {
          response.status(200).send({
            message: res,
            success: true,
          });
        })
        .catch((next) => console.error(next));
    })
    .catch((error) => {
      console.error(error);
      next(new BadRequest("Oops, an error has occured!"));
    });
};

// GET ALL SERVICE REQUEST
exports.getServiceRequests = (request, response) => {
  serviceRequest
    .find({})
    .then((res) => {
      response
        .status(200)
        .send({
          message: res,
          success: true,
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
};

// GET ALL SERVICE REQUEST OF A USER/CUSTOMER
exports.getUserServiceRequests = (request, response) => {
  serviceRequest
    .find({ serviceNumber: request.params.serviceNumber })
    .then((res) => {
      response
        .status(200)
        .send({
          message: res,
          success: true,
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
};

// GET A SINGLE SERVICE REQUEST
exports.getSingleServiceRequest = (request, response) => {
  serviceRequest
    .find({ serviceRequestNumber: request.params.serviceRequestNumber })
    .then((res) => {
      response
        .status(200)
        .send({
          message: res,
          success: true,
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
};

// sent uploaded image link
exports.uploadImage = (request, response) => {
  try {
    if (request.file && request.file.path) {
      return response
        .status(200)
        .json({ status: 0, success: true, imgUrl: request.file.path });
    } else {
      return response
        .status(422)
        .json({ status: 1, success: false, message: "no file provided" });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "some error occured" });
  }
};

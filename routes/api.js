const express = require("express");
const userOrder = require("../controllers/order");
const user = require("../controllers/userController");
const serviceRequest = require("../controllers/serviceRequestController");
const contactmessages = require("../controllers/ContactMessages");
const {
  verifyToken,
  generateRefreshToken,
} = require("../middlewares/verifyToken");
const fileUpload = require("../middlewares/fileUpload");
const cardboard = require("../controllers/cardboardModelController");
const sendOrderRequestEmail = require("../controllers/EmailController");
const router = express.Router();

// refresh token route
router.post("/refresh_token", generateRefreshToken);

/**
 *
 * ORDER MANAGEMENT SECTION
 *
 */

//creating new order
router.post("/orders/create", userOrder.createOrder);

//get all orders route
router.get("/orders/query/all", userOrder.getAllOrders);

//get user orders route
router.get("/orders/query/:mobileNumber", userOrder.getUserOrders);

// get a single order details route
router.get("/orders/user/query/:orderNumber", userOrder.getSingleOrder);

//update a single order route
router.put("/orders/update/:orderNumber", userOrder.updateOrder);

//delete a single order route
router.delete("/orders/delete/:orderNumber", userOrder.deleteOrders);

//delete aall orders route
router.delete("/orders/delete/app/all", userOrder.deleteAllOrders);

/**
 * USER MANAGEMENT SECTION
 *
 */

// UPDATE USER ACCOUNT DETAILS
router.put("/user/update/:userNumber", verifyToken, user.updateAccount);

// QUERY A SINGLE USER ACCOUNT
router.get("/user/query/:mobileNumber", verifyToken, user.getUserDetails);

// QUERY ALL USERS ACCOUNT
router.get("/user/query", verifyToken, user.getAllUsers);

// QUERY USER ACCOUNT
router.post("/user/query/login", user.login);

// CREATE USER ACCOUNT
router.post("/user/createAccount", user.createAccount);

// LOGOUT USER
router.post("/user/logout", verifyToken, user.logout);
// DELETE USER ACCOUNT
router.delete("/user/delete/:mobileNumber", verifyToken, user.deleteAccount);

// UPDATE SERVICE REQUEST
router.put(
  "/serviceRequest/update/:serviceRequestNumber",
  verifyToken,
  serviceRequest.updateServiceRequest
);

// CREATE SERVICE REQUEST
router.post(
  "/serviceRequest/createServiceRequest",
  verifyToken,
  serviceRequest.createServiceRequest
);

// DELETE A SERVICE REQUEST
router.delete(
  "/serviceRequest/delete/:serviceRequestNumber",
  verifyToken,
  serviceRequest.deleteServiceRequest
);

// QUERY ALL SERVICE REQUESTS
router.get(
  "/serviceRequest/query",
  verifyToken,
  serviceRequest.getServiceRequests
);

// QUERY A SINGLE SERVICE REQUEST
router.get(
  "/serviceRequest/query/:serviceRequestNumber",
  verifyToken,
  serviceRequest.getSingleServiceRequest
);

// QUERY A SINGLE CUSTOMER SERVICE REQUEST
router.get(
  "/serviceRequest/query/:mobileNumber",
  verifyToken,
  serviceRequest.getUserServiceRequests
);

//create contact us message
router.post(
  "/messages/appointment/create",
  contactmessages.createContactMessage
);

//query a contact us message
router.get(
  "/messages/appointment/query/:appointmentID",
  contactmessages.getContactMessage
);

//query a contact us message
router.get(
  "/messages/appointment/query",
  contactmessages.getAllContactMessages
);

// Sending email
router.post("/messages/request/send-email", sendOrderRequestEmail);

// UPLOAD IMAGE
router.post(
  "/messages/uploadImage",
  fileUpload.single("picture"),
  serviceRequest.uploadImage
);

// cardboard end points
router.post("/cardboard/create", cardboard.createCardboard);

router.get("/cardboard/query/all", cardboard.getAllCardBoard);

router.put("/cardboard/edit/update/:cardboardID", cardboard.updateCardBoard);

router.delete("/cardboard/edit/delete/", cardboard.deleteCardBoard);

router.delete("/cardboard/edit/delete/:cardbordID", cardboard.deleteCardBoard);

router.get("cardboard/info/query/:cardbordID", cardboard.getCardBoardDetails);

module.exports = router;

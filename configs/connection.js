require("dotenv").config();
const { MongoClient } = require("mongodb");
const orderRequest = require("../controllers/order");
const userRequests = require("../controllers/userController");
const transHelper = require("../helpers/trasactions");
const contactus = require("../controllers/ContactMessages");
const queryHelper = require("../helpers/queryHelper");
const cardboard = require("../controllers/cardboardModelController");
const client = new MongoClient(process.env.MD_RIGHTBOX_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 300000,
  keepAlive: 1,
});
client.connect(async () => {
  await userRequests.injectDB(client);
  await transHelper.injectDB(client);
  await queryHelper.injectDB(client);
  await orderRequest.injectDB(client);
  await contactus.injectDB(client);
  await cardboard.injectDB(client);
  console.log("connected to DB");
});

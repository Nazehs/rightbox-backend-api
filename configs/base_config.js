/*
* Set Server environment
* Available Environments Only : SIT, 8300, 9200, 9300, UAT, PREPROD, PROD
*/
let ENVIRONMENT = "UAT";
let ENVIRONMENT_PORT, HOME_ADDRESS;


switch (ENVIRONMENT) {
    case "UAT":
        ENVIRONMENT_PORT = 3001;
        // HOME_ADDRESS = "http://url";
        PORT = 3001;
        break;
    case "PPREPROD":
        ENVIRONMENT_PORT = 8300;
        // HOME_ADDRESS = "http://url";
        PORT = 8300;
        break;
    case "PROD":
        ENVIRONMENT_PORT = 8900;
        // HOME_ADDRESS = "http://url";
        PORT = 8400;
        break;
}


module.exports = {
    ENVIRONMENT,
    ENVIRONMENT_PORT,
    HOME_ADDRESS
}

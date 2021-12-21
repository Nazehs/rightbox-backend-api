const BASE_CONFIG = require('./base_config');

module.exports = {
    Envoirnment: BASE_CONFIG.ENVIRONMENT,
     PORT: BASE_CONFIG.ENVIRONMENT_PORT, 
    tokhash: "matawebbosssbsbt64y4diu53673838s",
    nodeName: "node1",
    // MLIFEMEAL_DB_URI: 'mongodb://127.0.0.1:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    LIFEMEAL_NS:'Lifemeal',
    tokenKey:"lifemeal$$app",
    ACCESS_TOKEN_SECRET:'GFJBNKJNJKHJNKJKJHJH',
    REFRESH_TOKEN_SECRET:'DFHJFHDHJFHDHJFDFDHH',
    SESSION_CLEARED: "Session Cleared",
    VALID_SESSION: "Valid session",
    IDLE_TIMEOUT: 15
};
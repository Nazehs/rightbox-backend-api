const { verify } = require('jsonwebtoken');
const  config = require('./../configs/config');


const getHeaders= req =>{

    const authorization = req.headers['authorization'];
    if(!authorization) throw new Error({message:'user not loggedin', status:2});

    const token = authorization.split(' ')[1];

    const { userId } = verify(token, config.ACCESS_TOKEN_SECRET);

    return userId;

}

module.exports = {
    getHeaders
}
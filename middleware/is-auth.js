const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error("not authentcated.")
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedtoken ;
    try{
        decodedtoken = jwt.verify(token, 'pooppooppooppoop');
    }catch(err){
        err.message = ("not authentcated.");
        err.statusCode= 500;
        throw err;
    } 
    if(!decodedtoken){
        const error = new Error("not authentcated.")
        error.statusCode= 401;
        throw error;
    }

    req.userID = decodedtoken.userID;
    next();
}; 

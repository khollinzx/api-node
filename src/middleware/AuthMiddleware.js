// this function get the token generated at the registration process
// and check if the token is valid and get the user id from it.
// inorde to access protected route
const jwt = require('jsonwebtoken');
const config = require('config');
const JsonAPIResponse = require('../helpers/JsonAPIResponse')

const secretKey = process.env.JWT_SECRET;

module.exports = (req, res, next) => {

    // Get the token from the header
    const token = req.header('Bearer');

    // Check if no token
    if (!token) {
        return JsonAPIResponse.SendErrorResponse(res, 'No Token Found, Authorization Denied')
    }

    // if there is token then Verify
    try {
        // validating the token if valid
        const decoded = jwt.verify(token, secretKey);
        /** extracting the user object from the token & passing it to
         a variable req.user inorder to get to user id */
        req.user = decoded.user;
        // after getting the user object go to the next command
        next();
    } catch (err) {
        return JsonAPIResponse.SendErrorResponse(res,'Token is not Valid');
    }
}
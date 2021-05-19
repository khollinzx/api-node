const JsonAPIResponse = require('../helpers/JsonAPIResponse')

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = function (req,res,next) {
    try {
        if (req.headers['accept'] !== 'application/json') {
            return JsonAPIResponse.SendErrorResponse(res, "Make sure that the Accept header is present and has application/json as the value.")
        }
        next();
    }catch (err) {
        return JsonAPIResponse.SendErrorResponse(err.message);
    }
}
/**
 *
 * @param res
 * @param message
 * @param data
 * @returns {Promise<*>}
 * @constructor
 */
exports.SendSuccessResponse = async (res, message, data) => {
    return res.status(200).json({status: true, message, data});
}

/**
 *
 * @param res
 * @param message
 * @param code
 * @returns {Promise<*>}
 * @constructor
 */
exports.SendErrorResponse = async (res, message, code) =>
{
    if(!code)
    {
        statusCode = 400;

    } else{

        statusCode = code;
    }

    return res.status(statusCode).json({status: false, message});
}

/**
 *
 * @param res
 * @param message
 * @returns {Promise<*>}
 * @constructor
 */
exports.SendServerErrorResponse = async (res, message) => {
    return res.send(500).send({status: false, message});
}


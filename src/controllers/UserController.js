const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { validationResult } = require('express-validator');
const UserModel = require('../models/UserModel');
const JsonAPIResponse = require('../helpers/JsonAPIResponse');

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.testing = async (req, res) => {
    return JsonAPIResponse.SendSuccessResponse(res,"welcome");
}


exports.loginUser = async  (req, res) => {
    const errors = validationResult(req);

    //validating and return a response if errors
    if (!errors.isEmpty()) {
        return JsonAPIResponse.SendErrorResponse(res,errors.array());
    }

    // Destructuring the Req.body for example access to the fields
    /**
     instead of res.body.name, res.body.email,
     res.body.password its will be just name, email, password
     */
    const {email, password} = req.body;

    try {
        // check if your exist in the database already
        // and passing the value to a variable $user
        let user = await UserModel.checkIfUserExist(email);

        // if the user is not a registered user return a error msg Invalid Credentials
        if (!user) {
            return JsonAPIResponse.SendErrorResponse(res,'Invalid Credentials');
        }

        // Checking if the user password matches
        const isPassowrdMatch = await bcrypt.compare(password, user.password);

        if (!isPassowrdMatch) {
            return JsonAPIResponse.SendErrorResponse(res,'Invalid Credentials');
        }

        // Generating & Returning jsonwebtoken
        // and adding the saved user id to the variable $payload
        const payload = {user: {id: user.id}}

        const token = UserModel.accessToken(payload);

        return JsonAPIResponse.SendSuccessResponse(res,"Login Successful", token);

    } catch (err) {
        // sending if there is a server error
        return JsonAPIResponse.SendErrorResponse(res,`Server Error: ${err.message}`);
    }
}

/**
 * This function create new User
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.userSignUp = async (req,res) => {
    const errors = validationResult(req);

    //validating and return a response if errors
    if (!errors.isEmpty()) {
        return JsonAPIResponse.SendErrorResponse(res,errors.array());
    }

    /**
     Destructuring the Req.body for example access to the fields
     instead of res.body.name, res.body.email,
     res.body.password its will be just name, email, password
     */
    const {name, email, password} = req.body;

    try {
        /** check if your exist in the database already and passing the value to a variable $user
         */
        let user = await UserModel.checkIfUserExist(email);

        // if the user is not a registered user return a error msg Invalid Credentials
        if (user) {
            return JsonAPIResponse.SendErrorResponse(res,'User already exist');
        }

        // Get user gravatar
        // if the user email has a gravatar account
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm',
        });

        const createdUser = await UserModel.createNewUser({name, email, avatar, password});

        // Generating & Returning jsonwebtoken
        // and adding the saved user id to the variable $payload
        const payload = {user: {id: createdUser.id, email: createdUser.email}}

        const token = UserModel.accessToken(res, payload);

        return token;

    } catch (err) {
        // sending if there is a server error
        return JsonAPIResponse.SendErrorResponse(res,`Server Error: ${err.message}`);
    }

}
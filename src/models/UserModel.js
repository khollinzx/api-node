const UserSchema = require('../database/migrations/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const config = require('config');
const JsonAPIResponse = require("../helpers/JsonAPIResponse");
const secretKey = config.get('jwtSecret');

// assiging the user id to the jwtToken to be generated
// and setting a expired time of 2hours
exports.accessToken = function (res,payload) {
    return  jwt.sign(payload, secretKey, {
                expiresIn: 3600000
                },
                (err, token) => {
                    // if error occur return error msg
                    if (err) throw err;
                    // if no error return the jwtToken that has the user id
                    JsonAPIResponse.SendSuccessResponse(res,"Sign Up Successful", token)
                }
            );
}

exports.checkIfUserExist = async function(email){
    return UserSchema.findOne({email})
}

exports.findUserById = async function(user_id){
    return UserSchema.findById(user_id).select('-password')
}

exports.createNewUser = async (req) => {
    newUser = new UserSchema({
                        name: req.name,
                        email: req.email,
                        avatar: req.avatar,
                        password: req.password,
                    });

    const salt = await bcrypt.genSalt(10);
    // hashing the password with the generated salt
    newUser.password = await bcrypt.hash(req.password, salt);

    // Saving the User
    return await newUser.save();
}
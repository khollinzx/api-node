const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Credentials for the database
 * the field for the database USER TABLE
 * @type {module:mongoose.Schema<Document, Model<Document>, UserSchema>}
 */
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        lowercase: true,
        trim: true,
        index: true

    },
    password: {
        type: String,
        required: [true, ' The password is required'],
        minlength: [8, 'The password must be at least 8 characters']
    },
    avatar: {
        type: String
    },
    phone: {
        type: String,
    }
    ,
    date: {
        type: Date,
        default: Date.now
    }
});

UserSchema.method("toJSON", function()
{
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    // delete  object.password;
    return object;

});

module.exports = User = mongoose.model('users', UserSchema);
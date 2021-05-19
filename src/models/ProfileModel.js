const ProfileSchema = require('../database/migrations/ProfileSchema');

exports.findProfileByUserId = async (user_id) => {
    return ProfileSchema.find({
        'user': user_id
    });
}

exports.findById = async (profile_id) => {
    return ProfileSchema.findById(profile_id);
}



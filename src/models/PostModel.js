const PostSchema = require('../database/migrations/PostSchema');

exports.createNewPost = async (req, user) => {
    newPost = new PostSchema({
        user: user.id,
        text: req.text,
        name: user.name,
        avatar: user.avatar
    });
    return newPost.save();
}

exports.fetchAllPosts = async () => {
    return PostSchema.find().sort({
        date: -1
    });
}

exports.fetchPostByUserId = async (user_id) => {
    return PostSchema.find({
        'user': user_id
    });
}

exports.fetchPostById= async (post_id) => {
    return PostSchema.findById(post_id);
}

exports.deletePost = async (postModel) => {
    postModel.remove();
}

exports.saveLikedPost = async (postModel,user_id) => {
    postModel.likes.unshift({
        user: user_id
    })
    return postModel.save()
}

exports.saveUnlikedPost = async (postModel, user_id) => {
    const getIndex = postModel.likes.map(like =>like.user.toString()).indexOf(user_id)
    postModel.likes.splice(getIndex,1);
    return postModel.save();
}
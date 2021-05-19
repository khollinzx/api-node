const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const JsonAPIResponse = require('../helpers/JsonAPIResponse');
const {validationResult} = require('express-validator')


/**
 * This function creates new post for a user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.addNewPost = async (req,res) => {
    // passing for validation
    const errors = validationResult(req.body);

    // Check if validation has error
    if (!errors.isEmpty()) {
        return JsonAPIResponse.SendErrorResponse(res,errors.array())
    }

    try {
        // find the user by Id
        // to get user name, avatar without the _password
        const user = await UserModel.findUserById(req.user.id);

        // Passing the fields value object to a placeholder
        const {text} = req.body;

        const addNewPost = await PostModel.createNewPost({text},user);

        return  JsonAPIResponse.SendSuccessResponse(res, "New Post created", addNewPost)

    } catch (err) {
        return JsonAPIResponse.SendErrorResponse(res,`Server Error: ${err.message}`);
    }
}

/**
 * This function fetches all posts
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.fetchAllPost = async (req,res) => {
    try {
        const posts = await PostModel.fetchAllPosts();

        return JsonAPIResponse.SendSuccessResponse(res, "All Posts", posts);
    }catch (err) {
        return JsonAPIResponse.SendErrorResponse(res,`Server Error: ${err.message}`);
    }
}

/**
 * This function fetches all particular user post
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.fetchPostByUserId = async (req,res) => {
    try {
        const posts = await PostModel.fetchPostByUserId(req.user.id);

        if(!posts)
            return JsonAPIResponse.SendErrorResponse(res, "No Post Found")

        return JsonAPIResponse.SendSuccessResponse(res, `User ${req.user.id} posts`, posts);
    }catch (err) {
        return JsonAPIResponse.SendServerErrorResponse(res,`Server Error: ${err.message}`);
    }
}

/**
 * fetch post by Id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.fetchPostById = async (req,res) => {
    try {
        const post = await PostModel.fetchPostById(req.params.post_id);

        if(!post)
            return JsonAPIResponse.SendErrorResponse(res, "No Post Found")

        return JsonAPIResponse.SendSuccessResponse(res, `Post`, post);
    }catch (err) {
        if(err.kind !== 'ObjectId') {
            return JsonAPIResponse.SendErrorResponse(res, "Post Not Found");
        }
        return JsonAPIResponse.SendServerErrorResponse(res,`Server Error: ${err.message}`);
    }
}

/**To delete a post
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.deleteUserPostById = async (req,res) => {
    try {
        const post = await PostModel.fetchPostById(req.params.post_id);

        if(!post)
            return JsonAPIResponse.SendErrorResponse(res, "No Post Found")

        //check if the user owns the post
        if(post.user.toString() !== req.user.id)
            return JsonAPIResponse.SendErrorResponse(res, "User is Unauthorized", 401)

        //delete the post
        await PostModel.deletePost(post);

        return JsonAPIResponse.SendSuccessResponse(res, `Post successfully deleted`);

    }catch (err) {
        if(err.kind !== 'ObjectId') {
            return JsonAPIResponse.SendErrorResponse(res, "Post Not Found");
        }
        return JsonAPIResponse.SendServerErrorResponse(res,`Server Error: ${err.message}`);
    }
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.likeUserPost = async (req,res) => {
    try {
        const post = await PostModel.fetchPostById(req.params.post_id);

        if(!post)
            return JsonAPIResponse.SendErrorResponse(res, "No Post Found")

        //check if the user owns the post
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
            return JsonAPIResponse.SendErrorResponse(res, "Post Has already been Liked")

        const likedPost = await PostModel.saveLikedPost(post, req.user.id);

        if(!likedPost){
            return JsonAPIResponse.SendErrorResponse(res, "Something Happened")
        }
        return JsonAPIResponse.SendSuccessResponse(res, `Post was successfully liked`);
    } catch (err) {
        if(err.kind !== 'ObjectId') {
            return JsonAPIResponse.SendErrorResponse(res, "Post Not Found");
        }
        return JsonAPIResponse.SendServerErrorResponse(res,`Server Error: ${err.message}`);
    }
}

exports.unlikeUserPost = async (req,res) => {
    try {
        const post = await PostModel.fetchPostById(req.params.post_id);

        if(!post)
            return JsonAPIResponse.SendErrorResponse(res, "No Post Found")

        //check if the user owns the post
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
            return JsonAPIResponse.SendErrorResponse(res, "Post Has not been Liked")

        const unlikedPost = await PostModel.saveUnlikedPost(post, req.user.id);

        if(!unlikedPost){
            return JsonAPIResponse.SendErrorResponse(res, "Something Happened")
        }
        return JsonAPIResponse.SendSuccessResponse(res, `Post was successfully unliked`);
    } catch (err) {
        if(err.kind !== 'ObjectId') {
            return JsonAPIResponse.SendErrorResponse(res, "Post Not Found");
        }
        return JsonAPIResponse.SendServerErrorResponse(res,`Server Error: ${err.message}`);
    }
}





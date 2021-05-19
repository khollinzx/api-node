const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const AuthMiddleware = require('../middleware/AuthMiddleware')
const UserController = require('../controllers/UserController')
const PostController = require('../controllers/PostController')


/**
 * User Auth Routes
 */
router.post('/login',[
    // Checking if the fields has values.
    check('email', 'Please enter a valid Email').isEmail(),
    check('password', 'Please enter Password').isLength({
        min: 6
    })
],UserController.loginUser);

router.post('/signup',[
    // Checking if the fields has values.
    check('name', 'Please enter a your Name').not().isEmpty(),
    check('email', 'Please enter a valid Email').isEmail(),
    check('password', 'Please enter Password').isLength({
        min: 6
    })
],UserController.userSignUp);

/**
 * Post Route Section
 */

//Add new post
router.post('/addPost',[AuthMiddleware,[
    // Checking if the fields has values.
    check('text', 'Please write a Text').isEmpty()]
],PostController.addNewPost)

//Fetches all posts
router.get('/all',AuthMiddleware,
    PostController.fetchAllPost)

//Fetches Specific User posts
router.get('/user/all',AuthMiddleware,
    PostController.fetchPostByUserId)

//Fetch post by Id
router.get('/:post_id',AuthMiddleware,
    PostController.fetchPostById)

//Delete User post by Id
router.delete('/:post_id/delete',AuthMiddleware,
    PostController.deleteUserPostById)

//Like a User post
router.put('/like/:post_id/',AuthMiddleware,
    PostController.likeUserPost)

//unlike a User post
router.put('/unlike/:post_id/',AuthMiddleware,
    PostController.unlikeUserPost)



module.exports = router;

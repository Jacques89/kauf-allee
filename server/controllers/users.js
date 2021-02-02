/**
 * users.js
 * @fileoverview Users Controller containing the logic for each user route
 * @param {Obj} User 
 * @author Jacques Nalletamby
 */

const { User } = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * GET CONTROLLERS
 */

/**
 * @apiName GetUsers
 * @api {get} /users
 * @apiDescription Get the Users information
 * @apiGroup Users
 * @apiPermission admin
 * @apiSuccess {String} name The Name of the User
 * @apiSuccess {String} email The email of the User
 * @apiSuccess {String} phone The phone number of the User
 * @apiSuccess {Boolean} isAdmin The Admin status of the User
 * @apiSuccess {String} street The street name of the User
 * @apiSuccess {String} apartment The apartment number of the User
 * @apiSuccess {String} postcode The postcode of the User
 * @apiSuccess {String} city The City of the User
 * @apiSuccess {String} country The country of the User
 * @apiSuccess {String} id The Id of the User
 * @apiError Users Not Found (500) Users could not be found
 */
exports.getUsers = async(req, res) => {
  const userList = await User.find().select('-passwordHash')

  if (!userList) {
    res.status(500).json({
      success: false
    })
  } 
  res.send(userList)
}

/**
 * @apiName GetUserId
 * @api {get} /users/:id
 * @apiDescription Get a specific User
 * @apiParam {String} id The String value of the User ID
 * @apiGroup Users
 * @apiPermission admin
 * @apiSuccess {String} name The Name of the User
 * @apiSuccess {String} email The email of the User
 * @apiSuccess {String} phone The phone number of the User
 * @apiSuccess {Boolean} isAdmin The Admin status of the User
 * @apiSuccess {String} street The street name of the User
 * @apiSuccess {String} apartment The apartment number of the User
 * @apiSuccess {String} postcode The postcode of the User
 * @apiSuccess {String} city The City of the User
 * @apiSuccess {String} country The country of the User
 * @apiSuccess {String} id The Id of the User
 * @apiError UserNotFound (500) User ID was not found
 */
exports.getUserId = async(req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash')

  if (!user) {
    res.status(500).json({
      message: 'The user ID was not found.'
    })
  } 
  res.status(200).send(user)
}

/**
 * @apiName GetUserCount
 * @api {get} 
 * @apiDescription Get the number of Users
 * @apiGroup Users
 * @apiPermission admin
 * @apiSuccess {Number} userCount The number of Users
 * @apiError NoAccessRight (401) User is not authorized 
 */
exports.getUserCount = async(req, res) => {
  const userCount = await User.countDocuments(count => count)

  if (!userCount) {
    res.status(500).json({
      success: false
    })
  }
  res.send({
    userCount: userCount
  })
}

/**
 * POST CONTROLLERS
 */

/**
 * @apiName PostUser
 * @api {post} /users
 * @apiDescription Create a new User
 * @apiGroup Users
 * @apiPermission admin
 * @apiSuccess {String} name The Name of the User
 * @apiSuccess {String} email The email of the User
 * @apiSuccess {String} phone The phone number of the User
 * @apiSuccess {Boolean} isAdmin The Admin status of the User
 * @apiSuccess {String} street The street name of the User
 * @apiSuccess {String} apartment The apartment number of the User
 * @apiSuccess {String} postcode The postcode of the User
 * @apiSuccess {String} city The City of the User
 * @apiSuccess {String} country The country of the User
 * @apiSuccess {String} id The Id of the User
 * @apiError UserNotCreated (500) User could not be created
 */
exports.postUser = async(req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    postcode: req.body.postcode,
    city: req.body.city,
    country: req.body.country,
  })
  user = await user.save()

  if (!user) {
    return res.status(400).send('User cannot be created!')
  }
  res.send(user)
}

/**
 * @apiName PostUserLogin
 * @api {post} /users/login
 * @apiDescription Login as authenticated User
 * @apiGroup Users
 * @apiPermission none
 * @apiSuccess {String} user The registered email address of the User
 * @apiSuccess {String} token The authentication token provided to the User
 * @apiError LoginFailed (400) Login Failed 
 */
exports.postUserLogin = async(req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const JWT_TOKEN = process.env.TOKEN

  if (!user) {
    return res.status(400).send('User not found')
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      }, 
      JWT_TOKEN, { expiresIn: '1d' }
    )
    
    res.status(200).send({ user: user.email, token: token })
  } else {
    res.status(400).send('Login failed')
  }
}

/**
 * @apiName PostUserRegister
 * @api {post} /users/register
 * @apiDescription Signup as authenticated User
 * @apiGroup Users
 * @apiPermission none
 * @apiSuccess {String} name The Name of the User
 * @apiSuccess {String} email The email of the User
 * @apiSuccess {String} phone The phone number of the User
 * @apiSuccess {Boolean} isAdmin The Admin status of the User
 * @apiSuccess {String} street The street name of the User
 * @apiSuccess {String} apartment The apartment number of the User
 * @apiSuccess {String} postcode The postcode of the User
 * @apiSuccess {String} city The City of the User
 * @apiSuccess {String} country The country of the User
 * @apiSuccess {String} id The Id of the User
 * @apiError SignupFailed (400) Signup Failed 
 */
exports.postUserRegister = async(req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    postcode: req.body.postcode,
    city: req.body.city,
    country: req.body.country,
  })
  user = await user.save()

  if (!user) {
    return res.status(400).send('User registration unsuccessful')
  }
  res.send(user)
}

/**
 * DELETE CONTROLLERS
 */

/**
 * @apiName DeleteUser
 * @api {delete} /users/:id
 * @apiDescription Delete an existing User
 * @apiParam {String} id String value of the category ID
 * @apiGroup User
 * @apiPermission admin
 * @apiError UserNotDeleted (404) The User could not be deleted
 */
exports.deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
  .then(user => {
    if (user) {
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully!'
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'User could not be deleted!'
      })
    }
  })
  .catch(err => {
    return res.status(400).json({
      success: false,
      error: err
    })
  })
}
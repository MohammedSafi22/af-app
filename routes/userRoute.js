const express = require('express');
const multer = require('multer');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData
} = require('../services/userSevice');

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator
} = require('../utils/validators/userValidator')

const authService = require('../services/authService');

const upload = multer({ dest: 'uploads/users' })

const router = express.Router();

router.use(authService.protect);

router.get('/getMe',getLoggedUserData,getUser);
router.put('/changeMyPassword',updateLoggedUserPassword);
router.put('/updateMe',updateLoggedUserValidator,updateLoggedUserData);
router.delete('/deleteMe',deleteLoggedUserData);


router.use(authService.allowedTo("admin"))

router.put('/changePassword/:id',changeUserPasswordValidator,upload.any(),changeUserPassword);

router.route('/')
.get(getUsers)
.post(upload.any(),createUserValidator,createUser);

router.route('/:id')
.get(getUserValidator,getUser)
.put(upload.any(),updateUserValidator,updateUser)
.delete(deleteUserValidator,deleteUser);

module.exports = router;
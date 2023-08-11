const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController')
userRouter.post('/deleteUser/:id',userController.deleteUser)
userRouter.get('/getDetailUser/id',userController.getDetailUser)
userRouter.get('/getAllUsers',userController.getAllUsers)
userRouter.post('/login',userController.login)
userRouter.post('/loginWithGoogle',userController.loginWithGoogle)
userRouter.post('/singUpWithGoogle',userController.singUpWithGoogle)
userRouter.post('/singUp',userController.singUp)
userRouter.post('/singUpWithPhone',userController.singUpWithPhone)
userRouter.post('/singUpWithEmail',userController.singUpWithEmail)
module.exports = userRouter
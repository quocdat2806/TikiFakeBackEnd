const User = require('../model/user')
const bcrypt = require('bcrypt')
const tokenService = require('../services/tokenService')
const twilio = require('twilio');
class UserService {
    singUp(data) {
        return new Promise(async (resolve, reject) => {
            const checkEmail = await User.findOne({ email: data.email })
            if (checkEmail) {
                resolve({
                    status: 400,
                    message: 'Email is already in use'
                })
            } else {
                const password = data.passWord
                const hash = bcrypt.hashSync(password, 10)
                const inforUser = {
                    email: data.email,
                    isAdmin: data?.isAdmin ? data.isAdmin : false,
                }
                const refreshToken = tokenService.refreshToken(inforUser)
                const accessToken = tokenService.accessToken(inforUser)

                const createUser = await User.create({
                    ...data,
                    passWord: hash,
                    refresh_token: refreshToken
                })
                resolve({
                    status: 200,
                    message: 'OK',
                    user: createUser,
                    accessToken: accessToken

                })
            }
        })
    }
    singUpWithGoogle(email, fullName, avatar) {
        return new Promise(async (resolve, reject) => {
            const user = await User.create({ email, fullName, avatar })
            resolve({
                status: 200,
                message: 'OK',
                user: user
            })
        })

    }
    signUpWithPhone() {
        const accountSid = 'AC12b6943b0cbe59add991b988a14a0d20';
        const authToken = '4ca625ed8cdc30b0152f8438758abd11';
        const client = twilio(accountSid, authToken);
        const min = 100000;
        const max = 999999;
        const random =  Math.floor(Math.random() * (max - min + 1)) + min +'';
        client.messages
          .create({
            from: '+12299494730',
            to: '+84973353861',
            body: 'hello con cho tu'+random
          })
          .then(message => console.log(message.sid))
          .catch(error => console.error(error));
    }
    loginWithGoogle(email) {
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({ email })
            resolve({
                status: 200,
                message: 'OKE',
                user: user
            })
        })

    }
    login(data) {
        return new Promise(async (resolve, reject) => {
            const userLogin = await User.findOne({ email: data.email })
            if (!userLogin) {
                resolve({
                    status: 400,
                    message: 'Email is not defined'
                })
            } else {
                const password = data.passWord

                bcrypt.compare(password, userLogin.passWord, function (err, result) {
                    if (result) {
                        const infor = {
                            _id:userLogin._id,
                            email: userLogin.email,
                            isAdmin: userLogin.isAdmin
                        }
                        const accessToken = tokenService.accessToken(infor);
                        resolve({
                            status: 200,
                            message: 'Login successful',
                            accessToken:accessToken

                        })
                    }
                    else {
                        resolve({
                            status: 400,
                            message: 'password faild'
                        })
                    }
                });

            }
        })
    }

    checkEmailIsCreated(email) {
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({ email: email })
            if (user) {
                resolve({
                    status: 200,
                    message: 'OKE',
                    user: user
                })
            } else {
                resolve({
                    status: 400,
                    message: 'NO USER IN DATABASE',
                })

            }

        })

    }
    getAllUsers() {
        return new Promise(async (resolve, reject) => {
            const users = await User.find({})
            resolve({
                status: 200,
                message: 'OKE',
                users: users
            })
        })


    }
    getDetailUser(id) {
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({ _id: id })
            if (!user) {
                resolve({
                    status: 400,
                    message: 'ERROR',
                })

            } else {
                resolve({
                    status: 200,
                    message: 'OKE',
                    users: user
                })
            }

        })
    }
    deleteUser(id) {
        return new Promise(async (resolve, reject) => {
            const user = await User.findByIdAndDelete({ _id: id }, { new: true })
            if (!user) {
                resolve({
                    status: 400,
                    message: 'ERROR',
                })

            } else {
                resolve({
                    status: 200,
                    message: 'OKE',
                })
            }

        })

    }
}


module.exports = new UserService
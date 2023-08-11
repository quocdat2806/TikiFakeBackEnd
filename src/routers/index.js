
const userRouter = require('./userRouter.js')
const router = function(app){
    app.use('/user',userRouter)

}
module.exports =router


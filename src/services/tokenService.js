const jwt = require('jsonwebtoken');

const refreshToken = (payload)=>{
const token = jwt.sign(payload,'refreshToken',{expiresIn:'2 days'})
return token

}
const accessToken = (payload)=>{
    const token = jwt.sign(payload,'accessToken',{expiresIn:'1h'})
    return token
    
    }
module.exports = { refreshToken,accessToken}


const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
const PORT = 8000
const router = require('./routers/index.js')
const db = require('./config/db')
db.connect();
router(app)
app.listen(PORT, function(){
    console.log('SERVER LISTEN ON '+PORT)
})



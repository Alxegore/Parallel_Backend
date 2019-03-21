// var express = require('express');
// const app = express()
// const cors = require('cors')
// app.use(cors())

// var globalLogicalTime = 0;

// const logicalTime = require('../models/logicalTime');
// // Set up mongoose connection
// var mongoose = require('mongoose');
// const dev_db_url = 'mongodb+srv://admineq:admineq@parallel-fnvjs.mongodb.net/test?retryWrites=true';
// // var mongoDB = process.env.MONGODB_URI || dev_db_url;
// mongoose.connect(dev_db_url);
// mongoose.Promise = global.Promise;

// async function getLogicalTime(){
//     var query = await logicalTime.findOneAndUpdate(
//         {}, 
//         { 
//            $inc: { logicalTime: 1 } 
//         }, {new: true })
//     globalLogicalTime = query.logicalTime
//     console.log(globalLogicalTime)
// }

// getLogicalTime()
// const mongoose = require('mongoose');

// // Counter Schema to store the last generated ID
// const counterSchema = new mongoose.Schema({
//   _id: { type: String, default:"employeeCounter " }, // This will store the counter identifier (e.g., 'employeeCounter')
//   count: { type: Number, default: 1000 }, // Starting value for the employee IDs
// });

// module.exports = mongoose.model('counterModel', counterSchema);

const mongoose = require('mongoose');

// Counter Schema to store the last generated employeeId
const counterSchema = new mongoose.Schema({
  _id: { type: String,default:"employeeCounter" }, // This will store a fixed value, such as 'employeeCounter'
  count: { type: Number, default: 1000 }, // Starting number for the employee IDs
});

module.exports= mongoose.model('Counter', counterSchema);
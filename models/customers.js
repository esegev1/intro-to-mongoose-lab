const mongoose = require('mongoose');

//create schema
const customerSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

//compile schema
const Customer = mongoose.model('Customer', customerSchema);

//export model
module.exports = Customer;
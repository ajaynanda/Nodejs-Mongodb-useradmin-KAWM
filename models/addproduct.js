const mongoose = require("mongoose");

var addproductschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  liter: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status:{
    type:String,
    default:"Active"
  }
});
const adddb = mongoose.model("addproduct", addproductschema);

module.exports = adddb;

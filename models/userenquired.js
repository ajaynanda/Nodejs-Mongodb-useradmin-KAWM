const mongoose = require("mongoose");

var userenquiryschema = new mongoose.Schema({
  name: {
    type: String
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String
  },

  product: {
    type: String,
    required: true,
  },

  qty: {
    type: Number,
    required: true,
  },
  closure: {
    type: String,
    required: true,
  },
  delivery: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Contacted",
  },
});
const enqdb = mongoose.model("enquiryuser", userenquiryschema)

module.exports = enqdb

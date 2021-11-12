const mongoose = require("mongoose");

var otpschema = new mongoose.Schema(
  {
    mobile: {
      type: Number,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now(), index: { expires: 300 } },
    //otp expire in 50min
  },
  { timestamps: true }
);
const otpdb = mongoose.model("otpdb", otpschema);

module.exports = otpdb;

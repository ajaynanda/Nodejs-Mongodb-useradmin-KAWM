var Userdb = require("../models/modeluser");
var enqdb = require("../models/userenquired");
const otpdb = require("../models/otpmodal");
const fast2sms = require("fast-two-sms");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
//create and save new user
exports.createuser = async (req, res) => {
  const password = req.body.password;
  const mobile = req.body.mobile;
  const name = req.body.name;

  Userdb.find({ mobile: req.body.mobile })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        req.flash("error", "Mobile Already Registered.");
        return res.redirect("/adminpage");
      }
      if (mobile.length != 10) {
        req.flash("error", "Enter valid mobile number");
        return res.redirect("/adminpage");
      }
      if (password.length < 6) {
        req.flash("errors", "Password must be atleast 6 characters");
        return res.redirect("/adminpage");
      } else {
        //password bcrypt
        bcrypt.hash(req.body.password, 10, (err, hashpass) => {
          if (err) throw err;
          const user = new Userdb({
            name: req.body.name,
            mobile: req.body.mobile,
            password: hashpass,
            status: "Active",
          });
          //addiing user

          user
            .save(user)
            .then((data) => {
              req.flash("success_msg", "The user successfully Added.");
              res.redirect("/adminpage");
              // res.json(data)
              console.log("user data inserted successfully by admin");
            })
            .catch((err) => {
              res
                .status(500)
                .send({ message: err.message || "some error occured" });
            });
        });
      }
    });
};

exports.activate = async (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    const users = Userdb.updateOne({ status: "Deactive", status: "Active" });

    Userdb.findByIdAndUpdate(id, users, { useFindAndModify: false })
      .then((user) => {
        req.flash("suces_msg", "User is activated with name " + user.name);
        res.redirect("/adminpage");
      })
      .catch((err) => res.status(422).json(err));
  }
};

exports.deactivate = async (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    const users = Userdb.updateOne({ status: "Active", status: "Deactive" });
    Userdb.findByIdAndUpdate(id, users, { useFindAndModify: false })
      .then((user) => {
     
        req.flash("suce_msg", "User is deactivated with name " + user.name);
        res.redirect("/adminpage");
      })
      .catch((err) => res.status(422).json(err));
  }
};
//user retrieving data
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    Userdb.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found the userwith id" + id });
        } else {
          console.log(id);
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "error occured" });
      });
  } else {
    Userdb.find()
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error while reading user information",
        });
      });
  }
};

//user enquiry retrieving data
exports.finds = async (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    enqdb
      .findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found the userwith id" + id });
        } else {
          console.log(id);
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "error occured" });
      });
  } else {
    enqdb
      .find()
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error while reading user information",
        });
      });
  }
};

//update user enquiry
exports.updateuserenquiry = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to updated cannot be empty" });
  }
  const id = req.params.id;
  const users = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    product: req.body.product,
    qty: req.body.qty,
    closure: req.body.closure,
    delivery: req.body.delivery,
    mode: req.body.onlineorcod,
    status: req.body.status
  };
  enqdb
    .findByIdAndUpdate(id, users, { useFindAndModify: false })
    .then((datas) => {
      if (!datas) {
        res.status(400).send({ message: "cannot update the user with ${id}" });
      } else {
     
        res.send(datas);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Found error on updating the user" });
    });
};
//update status enquiry- it is not working properly

exports.updatestatusenquiry = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to updated cannot be empty" });
  }
 
  const id = req.params.id;
  const users = {
    status: req.body.status
  };
  enqdb
    .findByIdAndUpdate(id, users, { useFindAndModify: false })
    .then((datas) => {
      console.log("hai")
      if (!datas) {
        res
          .status(400)
          .send({ message: "cannot update the user status with ${id}" });
      } else {
          console.log("Updating")
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Found error on updating the user status" });
    });
};

//update user
exports.updateuser = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to updated cannot be empty" });
  }
  const mobile = req.body.mobile;
  const password = req.body.password;
  if (mobile.length != 10) {
    req.flash("errors", "Enter valid mobile number");
    return res.redirect("/updateuser");
  }
  if (password.length < 6) {
    req.flash("errors", "Password must be atleast 6 characters");
    return res.redirect("/updateuser");
  } else {
    const id = req.params.id;
    let hashpass = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      mobile: req.body.mobile,
      password: hashpass,
    };

    Userdb.findByIdAndUpdate(id, user, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res
            .status(400)
            .send({ message: "cannot update the user with ${id}" });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Found error on updating the user" });
      });
  }
};

//user login with database value
exports.loginuser = async (req, res) => {
  var password = req.body.password;
  var mobile = req.body.mobile;

  await Userdb.findOne({ mobile, status: { $eq: "Active" } }).then((user) => {
    if (!user) {
      req.flash("error", "User Not found or Deactivated by admin");
      return res.redirect("/");
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (!result) {
          req.flash("error", "Password Incorrect");
          return res.redirect("/");
        }

        if (result) {
          let token = jwt.sign({ mobile: user.mobile }, "verySecretValue", {
            expiresIn: "1h",
          });

          console.log("User loggedin having mobile number " + mobile);
          req.flash("sucess_msg", "Welcome to User Dashboard");
          res.render("userhome");
        }
      });
    } else {
      req.flash("error", "Some error Occured");
    }
  });
};

//allenquiries by user
exports.allenquiry = (req, res) => {
  enqdb
    .find()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while reading user information",
      });
    });
};

exports.allenquiryuser = (req, res) => {
  enqdb
    .find()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while reading user information",
      });
    });
};
//otpsend
exports.otpsend = async (req, res) => {
  const mobile = req.body.mobile;
  const id = req.query._id;
  Userdb.findOne({ mobile: mobile })
    .exec()
    .then((user) => {
      if (!user) {
        return res.json({ message: "User not found" });
      } else {
        const otpcode = Math.floor(Math.random() * 1000000 + 1);
        console.log(otpcode);
        const otp = new otpdb({
          mobile: mobile,
          otp: otpcode,
        });
        var options = {
          authorization: process.env.API_KEY,
          message: "your otp" + otpcode,
          numbers: [req.body.mobile],
        };
        fast2sms.sendMessage(options).then((response) => {
          console.log(response);
        });
        otp.save(user).then((data) => {
          res.render("otpuser");
          // res.json(data)
          console.log("otp generated for mobile" + mobile);
        });
      }
    });
};

//verify the user otp

exports.verifyotp = async (req, res) => {
  otpdb
    .findOne({ otp: req.body.otp })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid otp");
        res.render("otpuser");
      }
      if (user) {
        req.query.otp = req.body.otp;
        res.render("resetpassword");
      }
    })
    .catch((err) => {
      res.json("some error occured");
    });
};

//resetpassword

exports.resetpassword = async (req, res) => {
  const password = req.body.password;
  const cpassword = req.body.cpassword;
  if (password != cpassword) {
    req.flash("error", "Password do not match");
    return res.render("resetpassword");
  }
  if (password.length < 6 && cpassword.length < 6) {
    req.flash("error", "Password must be atleast 6 characters long");
    return res.render("resetpassword");
  } else {
    Userdb.aggregate([
      {
        $lookup: {
          from: "otpdbs",
          localField: "mobile",
          foreignField: "mobile",
          as: "passwordreset",
        },
      },
      {
        $unwind: "$passwordreset",
      },
    ]).then(async (user) => {
      let hashpass = await bcrypt.hash(req.body.password, 10);
      console.log(user);
      const newpassword = {
        $set: { password: hashpass },
      };
      const users = Userdb.find({ mobile: req.body.mobile });
      Userdb.updateOne(users, newpassword, { useFindAndModify: false }).then(
        (user) => {
          console.log(user);
          res.redirect("/admins");
        }
      );
    });
  }
};

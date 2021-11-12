var adddb = require("../models/addproduct");
var enqdb = require("../models/userenquired");
var admindb = require("../models/admin");
var Userdb = require("../models/modeluser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create and save new user
exports.addproduct = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  }

  const user = new adddb({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    liter: req.body.liter,
    stock: req.body.stock,
    time: req.body.time,
    status: "Active",
  });

  //addiing product
  user
    .save(user)
    .then((data) => {
      req.flash("success_msg", "Product added successfully");
      res.redirect("/addproduct");
      console.log("Product data inserted");
    })

    .catch((err) => {
      res.status(500).send({ message: err.message || "some error occured" });
    });
};
//product retrieving data by user
exports.viewproduct = (req, res) => {
  adddb
    .find({ status: { $eq: "Active" } })
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while reading user information",
      });
    });
};
//retreiving product by admin
exports.viewadminproducts = (req, res) => {
  adddb
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

//adminregister
exports.adminregister = async (req, res) => {
  const password = req.body.password;
  const mobile = req.body.mobile;
  const name = req.body.name;

  Userdb.findOne({ mobile: mobile }).then((user) => {
    if (user) {
      req.flash(
        "error",
        "Mobile Number is already registered for User account"
      );
      return res.redirect("/adminreg");
    } else {
      admindb
        .find({ mobile: req.body.mobile })
        .exec()
        .then((user) => {
          if (user.length >= 1) {
            req.flash("error", "Mobile Already Registered.");
            return res.redirect("/adminreg");
          }
          if (mobile.length != 10) {
            req.flash("error", "Enter valid mobile number");
            return res.redirect("/adminreg");
          }
          if (password.length < 6) {
            req.flash("errors", "Password must be atleast 6 characters");
            return res.redirect("/adminreg");
          } else {
            //password bcrypt
            bcrypt.hash(req.body.password, 10, (err, hashpass) => {
              if (err) throw err;
              const user = new admindb({
                name: req.body.name,
                mobile: req.body.mobile,
                password: hashpass,
              });
              //adding admin to database

              user
                .save(user)
                .then((data) => {
                  req.flash(
                    "success_msg",
                    "The Admin successfully Added.You can log in to Admin dashboard"
                  );

                  res.redirect("/admins");

                  console.log("admin data inserted successfully by admin");
                })
                .catch((err) => {
                  res
                    .status(500)
                    .send({ message: err.message || "some error occured" });
                });
            });
          }
        });
    }
  });
};
//login of admin
exports.loginadmin = async (req, res) => {
  var password = req.body.password;
  var mobile = req.body.mobile;

  await admindb.findOne({ mobile }).then((user) => {
    if (!user) {
      req.flash("errorss", "Invalid mobile Number");
      return res.redirect("/admins");
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          req.flash("errorss", "Password Incorrect");
          return res.redirect("/admins");
        }

        if (result) {
          let token = jwt.sign({ mobile: user.mobile }, "verySecretValue", {
            expiresIn: "3h",
          });
          console.log("Token is " + token);
          console.log("admin loggedin having mobile number " + mobile);
          req.flash("sucess_msg", "Welcome to admin dashboard");
          res.redirect("/adminpage");
        }
      });
    } else {
      req.flash("errorss", "admin not found");
      return res.redirect("/admins");
    }
  });
};
//logout admin
exports.logoutadmin = (req, res) => {
  req.session.destroy(function (err) {
    return res.redirect("/admins");
  });
};
//logout user
exports.logoutuser = (req, res) => {
  req.session.destroy(function (err) {
    return res.redirect("/");
  });
};
//user enquiry

exports.userenquiry = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });

    return;
  }

  const user = new enqdb({
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    product: req.body.product,
    qty: req.body.qty,
    closure: req.body.closure,
    delivery: req.body.delivery,
    mode: req.body.onlineorcod,
  });
  //adding Enquiry
  user
    .save(user)
    .then((data) => {
      res.send(data);
      console.log("Enquiry added by user");
    })

    .catch((err) => {
      res.status(500).send({ message: err.message || "some error occured" });
    });
};

//activate and deactivate product
exports.activateproduct = async (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    const users = adddb.updateOne({ status: "Deactive", status: "Active" });

    adddb
      .findByIdAndUpdate(id, users, { useFindAndModify: false })
      .then((user) => res.redirect("/adminproduct"))
      .catch((err) => res.status(422).json(err));
  }
};

exports.deactivateproduct = async (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    const users = adddb.updateOne({ status: "Active", status: "Deactive" });
    adddb
      .findByIdAndUpdate(id, users, { useFindAndModify: false })
      .then((user) => {
        res.redirect("/adminproduct");
      })
      .catch((err) => res.status(422).json(err));
  }
};

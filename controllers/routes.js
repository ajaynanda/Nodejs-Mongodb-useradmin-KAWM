const express = require("express");
const router = express.Router();
const axios = require("axios");
const ejs = require("ejs");
const controller = require("../controllers/controllers");
const controllers = require("../controllers/addproductcontroller");
const upload = require("../middleware/fileupload");
const upload1 = require("../middleware/fileupload1");

var adddb = require("../models/addproduct");
var Userdb = require("../models/modeluser");

//getting userdata into browser
router.get("/adminpage", (req, res) => {
  axios
    .get("http://localhost:4000/find")
    .then((response) => {
      //  console.log(response.data)

      res.render("home", { users: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
});

//update user
router.get("/updateuser", (req, res) => {
  axios
    .get("http://localhost:4000/find", { params: { id: req.query.id } })

    .then(function (userdata) {
      res.render("updateuser", { user: userdata.data });
    })
    .catch((err) => {
      console.log(err);
    });
});
//getting userenquiry data in browser
router.get("/updatenquiry", (req, res) => {
  axios
    .get("http://localhost:4000/finds")
    .then((response) => {
      res.render("updateenquiry", { datas: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
});

//updating userenquiry data
router.get("/updatnquiry", (req, res) => {
  axios
    .get("http://localhost:4000/finds", { params: { id: req.query.id } })
    .then((usersdata) => {
      res.render("userequiryupdate", { datas: usersdata.data });
      console.log("user enquiry data updated");
    })
    .catch((err) => {
      res.send(err);
    });
});
//update status enquiry
router.get("/updatestatus", (req, res) => {
  axios
    .get("http://localhost:4000/finds", { params: { id: req.query.id } })
    .then((usersdata) => {
      res.render("updatestatusenquiry", { datas: usersdata.data });
      console.log("user enquiry status updated");
    })
    .catch((err) => {
      res.send(err);
    });
});

//rendering
router.get("/addproduct", (req, res) => {
  res.render("addproduct");
});
router.get("/enquiry", (req, res) => {
  res.render("userenquiry");
});

router.get("/", (req, res) => {
  res.render("userpage");
});
router.get("/newenquiry", (req, res) => {
  res.render("userenquiry");
});
router.get("/updateuser", (req, res) => {
  res.render("updateuser");
});
router.get("/allenquiry", (req, res) => {
  res.render("allenquiry");
});
router.get("/brochure", (req, res) => {
  res.render("brochure");
});
router.get("/market", (req, res) => {
  res.render("marketing");
});
router.get("/userhome", (req, res) => {
  res.render("userhome");
});
router.get("/admins", (req, res) => {
  res.render("adminloginform");
});
router.get("/updatestatusenquiry", (req, res) => {
  res.render("updatestatusenquiry");
});
router.get("/viewadminproduct", (req, res) => {
  res.render("viewadminproduct");
});
router.get("/forgot", (req, res) => {
  res.render("forgotpassword");
});
router.get("/adduser", (req, res) => {
  res.render("home", { messages: req.flash("info") });
});
router.get("/adminreg", (req, res) => {
  res.render("adminregister");
});
//reset password and otpsend
router.post("/forgot", controller.otpsend);
router.post("/otp", controller.verifyotp);
router.post("/reset", controller.resetpassword);
//file uploads marketing
router.post("/market", upload1, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("marketing", { msg: err });
    } else {
      console.log(req.file);
      console.log("file uploaded in marketing");
      req.flash("success_msg", "File uploaded successfully");
      res.redirect("/market");
    }
  });
});
//uploading brochure
router.post("/brochure", upload, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      req.flash("error", "Format not Supported");
      res.redirect("/brochure");
    } else {
      console.log(req.file);
      console.log("file uploaded in brochure");
      req.flash("success_msg", "File uploaded successfully");
      res.redirect("/brochure");
    }
  });
});
//searching data
router.get("/autocomplete/", (req, res, next) => {
  console.log("here");
  const regex = new RegExp(req.query["term"], "i");
  const userfilter = adddb
    .find({ name: regex }, { name: 1 })
    .sort({ "updated at": -1 })
    .sort({ "created at": -1 })
    .limit(20);
  userfilter.exec(function (err, data) {
    const results = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach((user) => {
          let obj = {
            id: user._id,
            label: user.name,
          };
          results.push(obj);
        });
      }
    }
    res.jsonp(results);
  });
});
router.get("/autocompleted/", (req, res, next) => {
  console.log("here");
  const regex = new RegExp(req.query["term"], "i");
  const usersfilter = Userdb.find({ name: regex }, { name: 1 })
    .sort({ "updated at": -1 })
    .sort({ "created at": -1 })
    .limit(20);
  usersfilter.exec(function (err, data) {
    console.log(data);
    const result = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach((users) => {
          let objs = {
            id: users._id,
            label: users.name,
          };
          result.push(objs);
        });
      }
    }
    res.jsonp(result);
  });
});
//search products by admins
router.get("/autosearched/", (req, res, next) => {
  console.log("here");
  const regex = new RegExp(req.query["term"], "i");
  const datafilter = adddb
    .find({ name: regex }, { name: 1 })
    .sort({ "updated at": -1 })
    .sort({ "created at": -1 })
    .limit(20);
  datafilter.exec(function (err, data) {
    console.log(data);
    const results = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach((data) => {
          let objs = {
            id: data._id,
            label: data.name,
          };
          results.push(objs);
        });
      }
    }
    res.jsonp(results);
  });
});
//activate and deactivate user by admin
router.get("/activate", controller.activate);
router.get("/deactivate", controller.deactivate);
//activate and deactivate product by admins
router.get("/activatepro", controllers.activateproduct);
router.get("/deactivatepro", controllers.deactivateproduct);
//ADMIN ADDING

//search users
router.post("/getuser", (req, res) => {
  let payload = req.body.payload.trim();
  console.log(payload);
});
//adding user by admin
router.post("/adduser", controller.createuser);
//view user enquiry by admin
router.get("/viewuserenquiry", (req, res) => {
  axios
    .get("http://localhost:4000/finds")
    .then((usersdata) => {
      res.render("viewuserenquiry", { datas: usersdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
});
//view user enquiry by user
router.get("/viewuserenquiryy", (req, res) => {
  axios
    .get("http://localhost:4000/finds")
    .then((usersdata) => {
      res.render("viewuserenquiryy", { datas: usersdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
});
//adding product by admin
router.post("/addproduct", controllers.addproduct);
//view product by user
router.get("/viewproduct", (req, res) => {
  axios
    .get("http://localhost:4000/viewproducts")

    .then((userdata) => {
      console.log(userdata.data);
      res.render("viewproducts", { data: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
});
//view product by admin
router.get("/adminproduct", (req, res) => {
  axios
    .get("http://localhost:4000/adminproducts")

    .then((userdata) => {
      res.render("viewadminproduct", { data: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
});
//viewing Product by user
router.get("/viewproducts", controllers.viewproduct);
//viewing Product by admin
router.get("/adminproducts", controllers.viewadminproducts);
//user login and logout
router.post("/login", controller.loginuser);
router.get("/logoutuser", controllers.logoutuser);
//admin login and logout
router.post("/adminlogin", controllers.loginadmin);
router.get("/logoutadmin", controllers.logoutadmin);
//user new enquiry
router.post("/enquiry", controllers.userenquiry);
//user data retrieving
router.get("/find", controller.find);
router.get("/finds", controller.finds);
//user allenquiry
router.get("/allenquiryuser", controller.allenquiryuser);

//update user
router.put("/updateuser/:id", controller.updateuser);

//update user enquiry
router.put("/updatnquiry/:id", controller.updateuserenquiry);
router.put("/updatstatus/:id", controller.updatestatusenquiry);
//adminregister
router.post("/adminreg", controllers.adminregister);

module.exports = router;

const path = require("path");
const multer = require("multer");

//storage engine

const storage = multer.diskStorage({
  destination: "./public/uploads/brochure",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

//uploads
const maxSize = 1 * 1024 * 1024; //1mb
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkfiletype(file, cb);
  },
  limits: { fileSize: maxSize },
}).single("file");

function checkfiletype(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname));
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Format not supported");
  }
}
module.exports = upload;

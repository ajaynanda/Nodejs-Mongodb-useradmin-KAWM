const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/uploads/marketing",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

//uploads
const maxSize = 5 * 1024 * 1024; //5mb
const upload1 = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkfiletype(file, cb);
  },
  limits: { fileSize: maxSize },
}).single("file1");

function checkfiletype(file, cb) {
  const filetypes = /mp4|jpeg|jpg|avi|pdf/;
  const extname = filetypes.test(path.extname(file.originalname));
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Format not supported");
  }
}
module.exports = upload1;

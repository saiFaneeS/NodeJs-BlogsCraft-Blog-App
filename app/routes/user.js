const { Router } = require("express");
const User = require("../models/user");
// const multer = require("multer");
// const path = require("path");


const router = Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(`./public/uploads/pfps`));
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//     console.log(fileName);
//   },
// });

// const upload = multer({ storage: storage });

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.create({
      fullName,
      email,
      password,
      // profileImageUrl: `/uploads/pfps/${req.file.filename}`,
    });
    console.log(user);
  } catch {
    console.log("All fields are required or Email already exists.");
    return res.render("signup");
  }
  return res.redirect("/user/signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password.",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;

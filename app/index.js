const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog");
const connectToMongoDB = require("./connection");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://127.0.0.1:27017/blogs");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: blogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT);

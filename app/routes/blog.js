const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
    console.log(fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  console.log(comments)
  return res.render("blog", {
    blog: blog,
    comments: comments,
    user: req.user,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const blog = await Blog.create({
    title: req.body.title,
    body: req.body.body,
    createdBy: req.user._id,
    coverImage: `/uploads/${req.file.filename}`,
  });
  console.log("Blog", blog);
  return res.redirect(`/`);
});

module.exports = router;

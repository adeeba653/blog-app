import express from "express";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import methodOverride from "method-override";

const app = express();
const port = 3000;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = path.join(__dirname, 'blogs.json');

// Fix — create the file with an empty array if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

let blogs = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
// Save helper
function saveBlogs() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
}

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));




app.get("/", (req, res) => {
  console.log(blogs);
  res.render("home.ejs", { blogs, currentPage:"home"});
});

app.get("/create", (req, res) => {
  res.render("create.ejs", { currentPage:"create" });
});
app.post("/create", (req, res) => {
  const { content } = req.body;
  const newPost = { id: crypto.randomUUID(),  content, day: dayjs().format("MMM DD YYYY"), time: dayjs().format("HH:mm") };
  blogs.push(newPost);
  saveBlogs(); // persists to disk
  res.redirect("/");
});

app.get("/blog/:id", (req, res) => {
   
  const post = blogs.find(b => b.id == req.params.id);
  const title = post.content.split("\n")[0].slice(0, 20) + "...";
console.log(title);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('blog-post', { post });
});
app.get("/about", (req, res) => {
  res.render("about.ejs", { currentPage:"about" });
});
app.get("/blog/:id/edit", (req, res) => {
  const post = blogs.find(obj => obj.id === req.params.id);
  res.render("edit.ejs", { post });
});
app.patch("/blog/:id", (req, res) => {
  const { title, content } = req.body;
  const postIndex = blogs.findIndex(obj => obj.id === req.params.id); 
  if (postIndex !== -1) {
    blogs[postIndex] = { ...blogs[postIndex], title, content , day: dayjs().format("MMM DD YYYY"), time: dayjs().format("HH:mm")};
    saveBlogs();
  }
  res.redirect(`/blog/${req.params.id}`);
});

// When deleting
app.delete("/blog/:id", (req, res) => {
  blogs = blogs.filter(b => b.id !== req.params.id);
  saveBlogs();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

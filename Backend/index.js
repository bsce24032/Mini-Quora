const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

let port = 8080;

let posts = [
    { id:uuidv4(), username: "apna college", content: "I Love Coding" },
    { id:uuidv4(), username: "Shahmeer", content: "Dream Big " },
    { id:uuidv4(), username: "Baber Azam", content: "Cover Drive" }
];

app.use(express.urlencoded({ extended: true })); // ✅ fixed here
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/posts", (req, res) => {  //first API INDEX(main)
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {  //Second API NEW POST
    res.render("new.ejs");
});

app.post("/posts",(req,res)=>{     //Support SEcond Api Form  Method post and action /posts
    let {username,content}=req.body;
    let id=uuidv4();
    posts.push({id,username,content});
    res.redirect("/posts")
})

app.get("/posts/:id", (req, res) => {  //third Api for Showing Id searched posts
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);

    if (!post) {
        return res.status(404).send("Post not found!");
    }

    res.render("show.ejs", { post });  // ✅ must pass post here
});


app.patch("/posts/:id", (req, res) => { //Fourth Api to Update Content with Patch Request
    let { id } = req.params;
    let { content } = req.body;

    let post = posts.find(p => p.id === id);
    if (!post) return res.status(404).send("Post not found");

    post.content = content;
    res.redirect("/posts");
});


app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    if (!post) return res.status(404).send("Post not found!");
    res.render("edit.ejs", { post });  // send post data to form
});

app.delete("/posts/:id",(req,res)=>{  //delete API for deleting POst 
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");

})

app.listen(port, () => {
    console.log("listening from port", port);
});

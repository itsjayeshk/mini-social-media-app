const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🔥 TEMP USER (until auth system)
const CURRENT_USER = "jayesh";

let posts = [
    { id: uuidv4(), username: 'John Doe', content: 'i am king', likes: [] },
    { id: uuidv4(), username: 'Jane Doe', content: 'i am queen', likes: [] },
    { id: uuidv4(), username: 'Jack Doe', content: 'i am prince', likes: [] },
];

// 👉 GET ALL POSTS
app.get('/posts', (req, res) => {
    res.render('index', { posts, currentUser: CURRENT_USER });
});

// 👉 NEW POST PAGE
app.get('/posts/new', (req, res) => {
    res.render('new.ejs');
});

// 👉 CREATE POST
app.post('/posts', (req, res) => {
    let id = uuidv4();
    let { username, content } = req.body;

    posts.push({ id, username, content, likes: [] });

    res.redirect('/posts');
});

// 👉 LIKE / UNLIKE (TOGGLE)
app.post('/posts/:id/like', (req, res) => {
    let { id } = req.params;
    let post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    let index = post.likes.indexOf(CURRENT_USER);

    if (index === -1) {
        post.likes.push(CURRENT_USER);
    } else {
        post.likes.splice(index, 1);
    }

    res.json({
        likes: post.likes.length,
        liked: post.likes.includes(CURRENT_USER)
    });
});

// 👉 SHOW POST
app.get('/posts/:id', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    res.render('show.ejs', { post });
});

// 👉 EDIT PAGE
app.get('/posts/:id/edit', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render('edit.ejs', { post });
});

// 👉 UPDATE POST
app.patch('/posts/:id', (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;

    let post = posts.find((p) => p.id === id);

    if (post) {
        post.content = newContent;
    }

    res.redirect('/posts');
});

// 👉 DELETE POST
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect('/posts');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
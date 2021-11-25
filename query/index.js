const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*
    posts === {
        "jakd2re": {
            id: "jakd2re",
            title: "post title",
            comments: [{
                id: "gdf232e", 
                content: "some comment"
            }]
        }, {...}, {...}
    }
*/
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === "CommentCreated") {
    const { id, postId, content, status } = data;
    const newComment = { id, content, status };
    posts[postId].comments.push(newComment);
  } else if (type === "CommentUpdated") {
    const { postId, id, status, content } = data;
    const comment = posts[postId].comments.find((c) => c.id === id);
    comment.status = status;
    comment.content = content;
  } else {
    console.log("Unhnadled event", type);
  }

  console.log(posts);
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening ot 4002");
});

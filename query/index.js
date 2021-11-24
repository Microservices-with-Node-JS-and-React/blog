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
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case "CommentCreated": {
      const { id, postId, content } = data;
      const newComment = { id, content };
      posts[postId].comments.push(newComment);
      break;
    }
    default: {
      console.log("Unhnadled event", type);
      break;
    }
  }
  console.log(posts);
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening ot 4002");
});

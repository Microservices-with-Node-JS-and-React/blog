const express = require("express");
const axios = require("axios");
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

  handleEvent(type, data);

  console.log(posts);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening ot 4002");

  const res = await axios.get("http://event-bus-srv:4005/events");
  res.data.forEach((event) => {
    console.log("Processing event:", event.type);

    handleEvent(event.type, event.data);
  });
});

const handleEvent = (type, data) => {
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
};

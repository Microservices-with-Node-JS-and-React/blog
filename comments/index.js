const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};
const pendingStatus = "pending";

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: pendingStatus });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: pendingStatus,
    },
  });
  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Event received:", req.body.type);

  const { type, data } = req.body;
  
  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comment = commentsByPostId[postId].find((c) => c.id === id);
    comment.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: Object.assign({}, data, { status }),
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});

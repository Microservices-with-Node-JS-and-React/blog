const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  switch (type) {
    case "CommentCreated":
      {
        let status;
        // simulate a delay for approval, 3 secs
        setTimeout(async () => {
          status = data.content.includes("orange") ? "rejected" : "approved";

          await axios.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: Object.assign({}, data, { status: status }),
          });
        }, 3 * 1000);
      }
      break;

    default:
      break;
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});

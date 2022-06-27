const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("", (req, res, next) => {
  res.status(200).send({
    message: "GET 요청이 성공적으로 수행됨",
  });
});

app.post("", (req, res, next) => {
  res.status(200).send({
    name: req.body.name,
    email: req.body.email,
  });
});

app.listen(3000, () => {
  console.log("starting server at port 3000..");
});

const express = require("express");
const git = require("@gitbeaker/node");
const router = express.Router();
const api = new git.Gitlab({
  host: "http://192.168.0.154/",
  token: "U5-wN2wrryjziiSzpjgA",
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  // res.render("index", { title: "Express" });
  let users = await api.Users.all();
  res.json(users.map((el) => el.username));
  console.log(__dirname);
});

module.exports = router;

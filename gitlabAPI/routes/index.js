const express = require("express");
const git = require("@gitbeaker/node");
const router = express.Router();
const api = new git.Gitlab({
  host: "http://192.168.0.154/",
  token: "U5-wN2wrryjziiSzpjgA",
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  let users = await api.Users.all();
  res.render("index", {
    title: "Tobesoft",
  });
  console.log(__dirname);
});

/* GET user list */
router.get("/user_list", async function (req, res) {
  let users = await api.Users.all();
  res.json(users.map((el) => el.username));
  console.log(__dirname);
});

router.get("/sign_up", function (req, res, next) {
  res.render("sign_up");
  console.log(__dirname);
});

/* POST user sing-up */
router.post("/create_user", (req, res) => {
  let gitUrl = "";
  const createUser = new Promise((resolve, reject) => {
    resolve(
      api.Users.create({
        email: req.body.email,
        name: req.body.name,
        username: req.body.id,
        password: req.body.pw,
        skip_confirmation: true,
      })
    );
  });
  const createProject = (user) =>
    new Promise((resolve, reject) => {
      console.log("user.id", user);
      resolve(
        api.Projects.create({
          userId: user.id,
          name: req.body.projectname,
        })
      );
    });
  const createToken = (user) =>
    new Promise((resolve, reject) => {
      gitUrl = user.http_url_to_repo;
      resolve(api.UserImpersonationTokens.add(user.owner.id, "test", ["api"], "2023-07-24T01:09:13.505Z"));
    });
  const returnUserInfo = (user) =>
    new Promise((resolve, reject) => {
      console.log("?????", user);
      res.send({
        errorCode: 0,
        errorMessage: "정상",
        id: req.body.id,
        name: req.body.name,
        pw: req.body.pw,
        token: user.token,
        email: req.body.email,
        projectname: req.body.projectname,
        deployurl: `http://server.tobesoft.com/${req.body.id}/${req.body.projectname}`,
        repositoryurl: gitUrl,
      });
    });

  console.log(req.body); // 사용자의 JSON 요청
  createUser
    .then((result) => createProject(result))
    .then((result) => createToken(result))
    .then((result) => returnUserInfo(result));
});

module.exports = router;

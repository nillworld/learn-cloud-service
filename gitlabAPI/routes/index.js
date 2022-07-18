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

router.get("/login", (req, res, next) => {
  const login = new Promise((resolve, reject) => {
    let username = req.query.id;
    console.log(username);

    resolve(api.Users.username(username));
    // // console.log(userInfo[0].id);
  });
  res.send(login);
});

router.get("/sign_up", function (req, res, next) {
  res.render("sign_up");
  console.log(__dirname);
});

router.get("/token_list", async function (req, res, next) {
  let username = req.query.username;
  console.log(username);
  let userInfo = await api.Users.username(username);
  console.log(userInfo[0].id);

  let users = await api.UserImpersonationTokens.all(userInfo[0].id);
  res.json(users);
  console.log(__dirname);
});

router.get("/test3", async function (req, res, next) {
  let users = await api.Users.projects(64);
  res.json(users);
  console.log(__dirname);
});

/* POST user sing-up */
router.post("/create_user", (req, res) => {
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
      console.log("user.id", user.id);
      resolve(
        api.Projects.create({
          userId: user.id,
          name: req.body.projectname,
        })
      );
    });
  const createToken = (user) =>
    new Promise((resolve, reject) => {
      resolve(
        api.UserImpersonationTokens.add({
          userId: user.id,
          name: "test",
          expiresAt: "2023-10-10",
          scopes: "api",
        })
      );
    });
  const returnUserInfo = (user) => {
    console.log("result!", user);
    return new Promise((resolve, reject) => {
      res.send({
        errorcode: 0,
        errormsg: "정상",
        id: req.body.id,
        name: req.body.name,
        pw: req.body.pw,
        email: req.body.email,
        projectname: user.name,
        deployurl: `http://server.tobesoft.com/${req.body.id}/${req.body.projectname}`,
        repositoryurl: user.http_url_to_repo,
      });
    });
  };

  console.log(req.body); // 사용자의 JSON 요청
  // res.send(createUser); // JSON 응답
  createUser.then((result) => createProject(result)).then((result) => returnUserInfo(result));
});

router.post("/test", async function (req, res) {
  console.log("test page");

  // let createToken = await api.UserImpersonationTokens.add({
  //   userId: 64,
  //   name: "test2",
  //   expiresAt: "2022-07-14T01:09:13.505Z",
  //   scopes: "api",
  // });

  let createToken = await api.UserImpersonationTokens.add(64, "test2", ["api"], "2022-07-14T01:09:13.505Z");

  console.log(req.body); // 사용자의 JSON 요청
  res.json(createToken); // JSON 응답
  console.log(createToken);
});

module.exports = router;

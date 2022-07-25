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

/* GET sign up page */
router.get("/sign_up", function (req, res, next) {
  res.render("sign_up");
  console.log(__dirname);
});

/* GET delete user page */
router.get("/delete_user", function (req, res, next) {
  res.render("delete_user");
  console.log(__dirname);
});

/* POST user sing-up */
router.post("/create_user", (req, res) => {
  let gitUrl = "";
  const createUser = new Promise((resolve, reject) => {
    api.Users.create({
      email: req.body.email,
      name: req.body.name,
      username: req.body.id,
      password: req.body.pw,
      skip_confirmation: true,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) =>
        res.send({
          errorCode: -200,
          errorMessage: "Can not create git user.",
        })
      );
  });
  const createProject = (user) =>
    new Promise((resolve, reject) => {
      console.log("user.id", user);
      api.Projects.create({
        userId: user.id,
        name: req.body.projectname,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) =>
          res.send({
            errorCode: -200,
            errorMessage: "Can not create git project repository.",
          })
        );
    });
  const createToken = (user) =>
    new Promise((resolve, reject) => {
      gitUrl = user.http_url_to_repo;
      api.UserImpersonationTokens.add(user.owner.id, "test", ["api"], "2023-07-24T01:09:13.505Z")
        .then((response) => {
          resolve(response);
        })
        .catch((error) =>
          res.send({
            errorCode: -200,
            errorMessage: "Can not create git Token.",
          })
        );
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

router.delete("/remove_user", (req, res) => {
  console.log("??????");

  const userInfo = (username) =>
    new Promise((resolve, reject) => {
      api.Users.search(username)
        .then((result) => {
          if (result[0]) {
            resolve(result);
          } else {
            reject(
              res.send({
                errorCode: -200,
                errorMessage: `Can not find the user '${username}'.`,
              })
            );
          }
        })
        .catch(() =>
          res.send({
            errorCode: -200,
            errorMessage: `Can not get '${username}' info for delete.`,
          })
        );
    });
  const deleteUser = (userInfo) =>
    new Promise((resolve, reject) => {
      api.Users.remove(userInfo[0].id)
        .then((result) => {
          resolve(result);
        })
        .catch(() =>
          res.send({
            errorCode: -200,
            errorMessage: `Can not get '${username}' info for delete.`,
          })
        );
    });

  userInfo(req.body.id)
    .then((result) => deleteUser(result))
    .then(() =>
      res.send({
        errorCode: -200,
        errorMessage: "정상",
        successMessage: "Delete success",
      })
    );
});

module.exports = router;

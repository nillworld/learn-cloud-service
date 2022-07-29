const express = require("express");
const git = require("@gitbeaker/node");
const router = express.Router();
const api = new git.Gitlab({
  host: "http://gitlab.tobedevops.com:19080/",
  token: "AH83S5johoj43NPvVfCo",
});

/** Schemas
 * @swagger
 *     components:
 *         schemas:
 *             UserList:
 *                 type: array
 *                 items:
 *                     type: string
 *                 example:
 *                     [userName1, userName2]
 *
 *             CreateUserRequest:
 *                 type: object
 *                 required:
 *                     - id
 *                     - name
 *                     - pw
 *                     - token
 *                     - email
 *                     - projectname
 *                 properties:
 *                     id:
 *                         type: string
 *                         description: what is your username(id)?
 *                     name:
 *                         type: string
 *                         description: what is your name?
 *                     pw:
 *                         type: string
 *                         description: what is password for sing-in?
 *                     email:
 *                         type: string
 *                         description: what is your email?
 *                     projectname:
 *                         type: string
 *                         description: which project name world you create?
 *                 example:
 *                     id: tobeprogrammer
 *                     name: tobe
 *                     pw: 1234qwer
 *                     email: tobeprogrammer@tobesoft.com
 *                     projectname: New project
 *
 *             CreateUserResponse:
 *                 type: object
 *                 properties:
 *                     errorCode:
 *                         type: integer
 *                         description: errorCode[0] = Success,
 *                                      errorCode[-200] = git 인증 오류
 *                     errorMessage:
 *                         type: string
 *                         description: describe the error message.
 *                     id:
 *                         type: string
 *                         description: user's userName(id)
 *                     name:
 *                         type: string
 *                         description: user's name
 *                     pw:
 *                         type: string
 *                         description: user's password
 *                     token:
 *                         type: string
 *                         description: user's access token
 *                     email:
 *                         type: string
 *                         description: user's email
 *                     projectname:
 *                         type: string
 *                         description: user's project name which is created.
 *                     deployurl:
 *                         type: string
 *                         description: project deploy URL.
 *                     repositoryurl:
 *                         type: string
 *                         description: project repository URL.
 *                 example:
 *                     errorCode: 0
 *                     errorMessage: Success
 *                     id: tobeprogrammer
 *                     name: tobe
 *                     pw: 1234qwer
 *                     token: fvekljgj3egi49ipgjtfjggds0
 *                     email: tobeprogrammer@tobesoft.com
 *                     projectname: New project
 *                     deployurl: https://service.tobesoft.com/tobeprogrammer/newproject
 *                     repositoryurl: https://gitlab.tobesoft.com/tobeprogrammer/newprojec
 *
 *             UserDeleteRequest:
 *                 type: object
 *                 required:
 *                     - id
 *                 properties:
 *                     id:
 *                         type: string
 *                         description: user's userName(id)
 *                 example:
 *                     id: tobeprogrammer
 *             UserDeleteResponse:
 *                 type: object
 *                 properties:
 *                     errorCode:
 *                         type: integer
 *                         description: errorCode[0] = Success,
 *                                      errorCode[-200] = git 인증 오류
 *                     errorMessage:
 *                         type: string
 *                         description: describe the error message.
 *                 example:
 *                     errorCode: 0
 *                     errorMessage: tobeprogrammer deleted
 */

/** Tags
 *  @swagger
 *  tags:
 *    name: User
 *    description: API to manage Gitlab Users
 */
router.get("/", async function (req, res, next) {
  res.render("index", {
    title: "Tobesoft",
  });
  console.log(__dirname);
});

/** GET user list
 *  @swagger
 *  paths:
 *   /user-list:
 *     get:
 *       summary: Lists all Users
 *       tags: [User]
 *       responses:
 *         "200":
 *           description: The list of user's usernames.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserList'
 */
router.get("/user-list", async function (req, res) {
  let users = await api.Users.all();
  res.json(users.map((el) => el.username));
  console.log(__dirname);
});

/* GET sign up page */
router.get("/sign-up", function (req, res, next) {
  res.render("sign-up");
  console.log(__dirname);
});

/* GET delete user page */
router.get("/delete-user", function (req, res, next) {
  res.render("delete-user");
  console.log(__dirname);
});

/** POST user sing-up
 * 	@swagger
 * 	paths:
 *   /user:
 *     post:
 *       summary: Creates a User and repository
 *       tags: [User]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserRequest'
 *       responses:
 *         "200":
 *           description: The created User.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CreateUserResponse'
 */
router.post("/create-user", (req, res) => {
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
  const returnUserInfo = (user) => {
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
  };

  console.log(req.body); // 사용자의 JSON 요청
  createUser
    .then((result) => createProject(result))
    .then((result) => createToken(result))
    .then((result) => returnUserInfo(result));
});

/** DELETE user and user project
 * 	@swagger
 * 	paths:
 *   /user:
 *     delete:
 *       summary: Delete the user
 *       tags: [User]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDeleteRequest'
 *       responses:
 *         "200":
 *           description: Delete the user success.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserDeleteResponse'
 */
router.delete("/user", (req, res) => {
  const userInfo = (username) =>
    new Promise((resolve, reject) => {
      api.Users.search(username)
        .then((result) => {
          if (result.length === 1) {
            console.log(username, result[0]);
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
          // console.log(userInfo);
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
        errorCode: 0,
        errorMessage: `'${req.body.id}' deleted`,
      })
    );
});

module.exports = router;

var exec = require("child_process").exec,
  child;

/**
 * Execute simple Shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

child = exec("pwd", function (error, stdout, stderr) {
  console.log("stdout: " + stdout);
  console.log("stderr: " + stderr);
  if (error !== null) {
    console.log("exec error: " + error);
  }
});

async function main() {
  const gitlab_host = "http://192.168.0.154";
  const gitlab_user = "root";
  const gitlab_password = "1q2w3e4r.";
  let { stdout } = await sh("/get_gitlab_personal_access_token.sh");
  for (let line of stdout.split("\n")) {
    console.log(`node version: ${line}`);
  }
}
var express = require("express"),
  http = require("http"),
  path = require("path"),
  bodyParser = require("body-parser"),
  static = require("serve-static"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session");

var app = express();
app.use(cookieParser());
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);
var router = express.Router();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/public", static(path.join(__dirname, "public")));
router.route("/process/product").get(function (req, res) {
  console.log("/process/product 호출됨");
  if (req.session.user) {
    res.redirect("/public/product.html");
  } else {
    res.redirect("/public/login.html");
  }
});
router.route("/process/login").post(function (req, res) {
  console.log("/process/login 호출됨");
  var paramId = req.body.id || req.query.id;
  var paramPw = req.body.password || req.query.password;
  if (req.session.user) {
    console.log("이미 로그인되어 상품페이지로 이동");
    res.redirect("/public/product.html");
  } else {
    main();
    req.session.user = {
      id: paramId,
      name: "zini",
      authorized: true,
    };
    res.writeHead("200", {
      "Content-Type": "text/html;charset=utf8",
    });

    res.write("<h1>로그인 성공</h1>");
    res.write("<div><p>Param ID: " + paramId + "</p></div>");
    res.write("<div><p>Param PW: " + paramPw + "</p></div>");
    res.write("<br><a href='/process/product'>상품 페이지로 이동</a>");
    res.end();
  }
});
router.route("/process/logout").get(function (req, res) {
  console.log("/process/logout 호출됨");

  if (req.session.user) {
    console.log("로그아웃");

    req.session.destroy(function (err) {
      if (err) throw err;
      console.log("세션 삭제하고 로그아웃됨");
      res.redirect("/public/login.html");
    });
  } else {
    console.log("로그인 상태 아님");
    res.redirect("/public/login.html");
  }
});
app.use("/", router);

http.createServer(app).listen(3000, function () {
  console.log("Express 서버가 3000번 포트에서 시작");
});

console.log("test...");

// http://zinirun.blogspot.com/2020/03/nodejs_81.html

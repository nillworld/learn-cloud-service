import express from "express";
import path from "path";
import { Gitlab } from "@gitbeaker/node";

const api = new Gitlab({
  host: "http://192.168.0.154/",
  token: "U5-wN2wrryjziiSzpjgA",
});

const __dirname = path.resolve();
const app = express();

app.use(express.json());

app.listen(3000, function () {
  console.log("start! express server on port 3000");
});

let users = await api.Users.all();
let createUser = await api.Users.create();
app.get("/", function (req, res) {
  res.json(users.map((el) => el.username));
  console.log(__dirname);
});

app.post("/", function (req, res) {
  console.log(req.body); // 사용자의 JSON 요청
  res.send(req.body); // JSON 응답
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/main.html");
});

// localhost:3000/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get("/main", function (req, res) {
  res.sendFile(__dirname + "/public/main.html");
});

// https://github.com/jdalrymple/gitbeaker

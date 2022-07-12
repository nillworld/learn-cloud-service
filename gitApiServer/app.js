const express = require("express");
const http = require("http");
const app = express();

app.set("port", process.env.PORT || 8001);

http.createServer(app).listen(app.get("port"), () => {
  console.log("Express server listening on Port" + app.get("port"));
});

app.use();

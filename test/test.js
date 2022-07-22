fetch("http://192.168.0.175:3100/api/v1/user", {
  method: "get",
  body: JSON.stringify({ access_token: "6f001333c51af286476cc77ef8a1eed6fb7f1f24" }),
}).then((response) => console.log(response.json()));

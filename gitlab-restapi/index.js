import { Gitlab } from "@gitbeaker/node";

const api = new Gitlab({
  host: "http://192.168.0.154/",
  token: "U5-wN2wrryjziiSzpjgA",
});

// Listing users
let users = await api.Users.all();
console.log(users.map((el) => el.username));

// Or using Promise-Then notation
// api.Projects.all().then((projects) => {
//   console.log(projects);
// });

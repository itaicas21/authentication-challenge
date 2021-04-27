const {
  hashSync,
  genSaltSync,
  compareSync,
  compare,
  hash,
  genSalt,
} = require("bcrypt");

const USERS = [
  {
    email: "admin@email.com",
    name: "admin",
    password: hashSync("Rc123456!", genSaltSync(10)),
    isAdmin: true,
  },
];
const INFORMATION = [
  { email: "admin@email.com", info: "admin info" },
];
const REFRESHTOKENS = [];
module.exports = { USERS, INFORMATION, REFRESHTOKENS };

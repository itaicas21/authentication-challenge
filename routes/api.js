const { Router } = require("express");
const apiRouter = Router();
const {
  hashSync,
  genSaltSync,
  compareSync,
  compare,
  hash,
  genSalt,
} = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
const { USERS, INFORMATION, REFRESHTOKENS } = require("../db");
const { isAdmin } = require("../middlewares");
apiRouter.get("/v1/information", (req, res, next) => {
  const accessToken = req.headers.authorization.slice(7);
  if (!accessToken)
    return res.status(401).send("Access Token Required");
  verify(accessToken, "secretKey", (err, decoded) => {
    if (err) return res.status(403).send("Invalid Access Token");
    const body = INFORMATION.filter((e) => e.email === decoded.email);
    console.log(decoded);
    console.log(body);
    res.status(200).json(body);
  });
});
apiRouter.get("/v1/users", isAdmin, (req, res, next) => {
  const accessToken = req.headers.authorization.slice(7);
  if (!accessToken)
    return res.status(401).send("Access Token Required");
  verify(accessToken, "secretKey", (err, decoded) => {
    if (err) return res.status(403).send("Invalid Access Token");
    res.json(USERS);
  });
});
module.exports = apiRouter;

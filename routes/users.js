const { Router } = require("express");
const userRouter = Router();
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

userRouter.post("/register", (req, res, next) => {
  const body = req.body;
  if (USERS.some((e) => e.name === body.name)) {
    return res.status(409).send("user already exists");
  }
  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  USERS.push({ ...body, isAdmin: false });
  INFORMATION.push({ email: body.email, info: `${body.name} info` });
  console.log(INFORMATION);
  // body.password = undefined;
  //   const jwt_token = sign(body, "secretKey", { expiresIn: "1h" });
  res.status(201).send("Register Success");
});

userRouter.post("/login", (req, res, next) => {
  const body = req.body;
  const userToFind = USERS.find((e) => e.email === body.email);
  if (!userToFind) {
    return res.status(404).send("cannot find user");
  }

  if (!compareSync(body.password, userToFind.password)) {
    return res.status(403).send("User or Password Incorrect");
  }
  const dataInToken = {
    name: userToFind.name,
    email: userToFind.email,
    isAdmin: userToFind.isAdmin,
  };

  const refreshToken = sign(dataInToken, "refreshSecret", {
    expiresIn: "45d",
  });
  REFRESHTOKENS.push(refreshToken);
  const accessToken = sign(dataInToken, "secretKey", {
    expiresIn: "10s",
  });
  res.status(200).send({ accessToken, refreshToken, ...dataInToken });
});

userRouter.post("/tokenValidate", (req, res, next) => {
  const accessTokenToCheck = req.headers.authorization.slice(7);
  if (!accessTokenToCheck) {
    res.status(401).send("Access Token Required");
  }

  verify(accessTokenToCheck, "secretKey", (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid Access Token");
    }
    res.send(true);
  });
});

userRouter.post("/token", (req, res, next) => {
  const refreshToken = req.body.token;
  if (!refreshToken)
    return res.status(401).send("Refresh Token Required");
  verify(refreshToken, "refreshSecret", (err, decoded) => {
    if (err) return res.status(403).send("Invalid Refresh Token");
    const { iat, exp, ...rest } = decoded;
    console.log(rest);
    const accessToken = sign(rest, "secretKey", {
      expiresIn: "10s",
    });
    res.json({ accessToken });
  });
});
userRouter.post("/logout", (req, res, next) => {
  const refreshToken = req.body.token;
  if (!refreshToken)
    return res.status(400).send("Refresh Token Required");
  verify(refreshToken, "refreshSecret", (err, decoded) => {
    if (err) return res.status(400).send("Invalid Refresh Token");
    const indexOf = REFRESHTOKENS.indexOf(refreshToken);
    console.log(indexOf);
    if (!(indexOf > -1)) return res.status(500).send("What?");
    REFRESHTOKENS.splice(indexOf, 1);
    res.status(200).send("User Logged Out Successfully");
  });
});

module.exports = userRouter;

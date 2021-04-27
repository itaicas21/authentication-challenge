/* write your server code here */
const { verify } = require("jsonwebtoken");
const { Router } = require("express");

const optionsarray = [
  {
    method: "post",
    path: "/users/register",
    description: "Register, Required: email, name, password",
    example: {
      body: {
        email: "user@email.com",
        name: "user",
        password: "password",
      },
    },
  },
  {
    method: "post",
    path: "/users/login",
    description: "Login, Required: valid email and password",
    example: {
      body: { email: "user@email.com", password: "password" },
    },
  },
  {
    method: "post",
    path: "/users/token",
    description: "Renew access token, Required: valid refresh token",
    example: { headers: { token: "*Refresh Token*" } },
  },
  {
    method: "post",
    path: "/users/tokenValidate",
    description:
      "Access Token Validation, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "get",
    path: "/api/v1/information",
    description:
      "Access user's information, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "post",
    path: "/users/logout",
    description: "Logout, Required: access token",
    example: { body: { token: "*Refresh Token*" } },
  },
  {
    method: "get",
    path: "api/v1/users",
    description:
      "Get users DB, Required: Valid access token of admin user",
    example: { headers: { authorization: "Bearer *Access Token*" } },
  },
];

const options = Router();
options.options("/", (req, res, next) => {
  let accessToken = req.get("authorization");
  if (!accessToken) {
    return res.json([optionsarray[0], optionsarray[1]]);
  }
  accessToken = req.get("authorization").slice(7);
  console.log(accessToken);
  verify(accessToken, "secretKey", (err, decoded) => {
    if (err) {
      return res.json([
        optionsarray[0],
        optionsarray[1],
        optionsarray[2],
      ]);
    }

    if (!decoded.isAdmin) {
      return res.json([
        optionsarray[0],
        optionsarray[1],
        optionsarray[2],
        optionsarray[3],
        optionsarray[4],
        optionsarray[5],
      ]);
    }

    return res.json(optionsarray);
  });
});
module.exports = options;

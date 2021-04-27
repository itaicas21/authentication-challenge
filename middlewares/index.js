const { verify } = require("jsonwebtoken");

function isAdmin(req, res, next) {
  const accessToken = req.headers.authorization.slice(7);

  verify(accessToken, "secretKey", (err, decoded) => {
    if (err) return res.status(403).send("Invalid Access Token");
    if (!decoded.isAdmin) return res.status(401).send("Not Admin");
    return next();
  });
}
module.exports = { isAdmin };

const { verify } = require("jsonwebtoken");

const APP_SECRET = "appsecret321";

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

function getUserId(ctx) {
  const Authorization = ctx.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const verifiedToken = verify(token, APP_SECRET);
    return verifiedToken && verifiedToken.userId;
  }

  throw new AuthError();
}

module.exports = {
  getUserId,
  APP_SECRET
}
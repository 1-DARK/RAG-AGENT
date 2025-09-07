import jwt from "jsonwebtoken";

export const generateToken = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "3d", // expiry of your token
  }); // create token

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day in millisecond
    httpOnly: true, //Protects against cross-site scripting (XSS) attacks, as attackers can't access the cookie via JavaScript
    sameSite: "strict", //If a user clicks a link or submits a form on your site  the browser includes the JWT cookie in the request
    secure: process.env.NODE_ENV !== "development", //cookie will only be sent over HTTPS in non-development environments but not in development, where HTTP might be used for testing
  });

  return token;
};

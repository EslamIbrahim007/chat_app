import jwt from "jsonwebtoken";


const createToken = (payload, res) => {
  const token = jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_DATE });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,//MS
    httpOnly: true, // only accessible via HTTP requests pervent xss attacks cross-site
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"//CSRF Attacks cross-site req forgery attacks
  });
  return token;
};


export default createToken
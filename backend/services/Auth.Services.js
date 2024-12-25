import expressHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import ApiErrors from '../utils/apiErrors.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from '../config/cloudinary.js'



//@desc Sign Up
//@route POST /api/auth/signup
//@access Public
export const signUp = expressHandler(async (req, res, next) => {
  //1 create Create User
  const user = await UserModel.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  });
  //2 create and send token
  const token = createToken(user._id, res);
  //3 send response and the token
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    _id: newUser._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    token: token,
  });
});

//@desc log In
//@route POST /api/auth/login
//@access Public
export const logIn = expressHandler(async (req, res, next) => {
  // 1) check if password and email in the body(validation);
  //2) check if user exist and if the password is correct;
  const user = await UserModel.findOne({ email: req.body.email });
  const comparePassword = await bcrypt.compare(req.body.password, user.password);
  if (!user || !comparePassword) {
    throw new ApiErrors('Invalid email or password', 401);
  };
  //3) create and send token
  const token = createToken(user._id, res);

  res.status(201).json({
    status: 'success',
    message: 'Logged in successfully',
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    token: token,
  });
});

//@desc logOut
//@route POST /api/auth/logOut
//@ access Public
export const logOut = expressHandler(async (req, res, next) => {
  // Clear the JWT from cookies 
  res.cookie('jwt', '', { maxAge: 0 });

  // Optionally, you can also send a response header to clear the token in the client-side storage 
  res.setHeader('Authorization', '');

  res.status(200).send({
    message: 'Logged out successfully'
  });
});

//@desc check if user is loged in or not
export const protect = expressHandler(async (req, res, next) => {
  // 1) Check if the token exists and store it 
  const token = req.cookies.jwt;
  if (!token) { 
    return next(new ApiErrors("You aren't logged in. Please log in.", 401));
  }
  // 2) Check if token is valid or expired 
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) Check if the user exists
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiErrors("The user belonging to this token does not exist.", 401));
  } // 4) Check if the user changed their password after the token was issued 
   // 5) Store the user in the request 
  req.user = currentUser;
  next();
});


//@desc update img pic
//@route PUT /api/auth/update-profile
//@access Private
export const updateProfile = expressHandler(async (req, res, next) => {
  //1 fetch the img and user and store them
  const { profilePic } = req.body
  const userId = req.user._id;
  if (!profilePic){
    return next(new ApiErrors('profile pic is required', 404));
  };
  //2 update the user img / upload it to cloudinary
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  //3 update user in DB
  const updateUser = await UserModel.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select('-password');
  //4 send res
  res.status(200).json(updateUser);
});


export const checkAuth = expressHandler((req,res)=>{
  res.status(200).json(req.user)
})
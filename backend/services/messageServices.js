import expressHandler from "express-async-handler";
import ApiErrors from "../utils/apiErrors.js";
import cloudinary from '../config/cloudinary.js'

import userModel from '../models/userModel.js';
import messageModel from './../models/message.Model.js';
import { getReceiverSocketId,io } from '../utils/socket.js';

//@desc getUsers
//@route GET /api/message/users
//@access private
export const getUsers = expressHandler(async (req, res, next) => {
  //1 check if the user log in (protect  function)
  //2 fetch all user but not our self
  const loggedInUserId = req.user._id;
  const filteredUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
  //3 send response
  res.status(200).json(filteredUsers)
});

//@desc getMessage
//@route GET /api/message/:id
//@access private
export const getMessage = expressHandler(async (req, res, next) => {
  //1 store sender and receiver id
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  //2 get all msg belong to sender and receiver
  const messages = await messageModel.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });
  //3 send response
  res.status(200).json(messages);
});

//@desc sned Message
//@route POST /api/message/send
//@access private

export const sendMessage = (async (req, res, next) => {
  // 1 fitch message from body store sender receiver and message in const
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;
  //2 if the msg is image upload it to cloudinary
  let imageUrl
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }
  //3 create the message
  const newMessage = await messageModel.create({
    senderId,
    receiverId,
    text,
    image: imageUrl
  })
  //4 socket.io function
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage)
  }
  //5 send respone
  res.status(200).json(newMessage);
})
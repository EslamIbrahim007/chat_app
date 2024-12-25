import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String
  }
},{timestamps:true});

//create model
const messageModel = model('Message', messageSchema);

export default messageModel;

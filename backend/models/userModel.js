import {Schema , model} from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        trim:true,
    },
    password:{
        type: String,
        required:[true,'password is required'],
        minLength:[8,'password must be at least 8 characters'],
    },
    phone:String,
    profilePic: {
        type: String,
        default:""
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
},{timestamps:true});

//hash the password before save the user
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
//create userModel
const userModel = model("User", userSchema);

export default userModel;
import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.BD_URL).then((conn) => {
        console.log(`Datebase connection successfully connected to ${conn.connection.host}`);
    })
};

export default dbConnection;
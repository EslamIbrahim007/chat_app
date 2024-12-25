import path from "path";

const __dirname = path.resolve();

import express from 'express';
import morgan from 'morgan';
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from 'helmet'
import 'dotenv/config';

import dbConnection from "./config/database.js";
import ApiErrors from "./utils/apiErrors.js";
import globalError from "./middleware/errorMiddleware.js";

import { app,server } from "./utils/socket.js";
const port = process.env.PORT || 5000;


// Use Helmet to set various security headers
app.use(helmet());
//db Connection
dbConnection()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
})); // Allow cross-origin requests

// route 
import authRoute from './routes/auth.route.js'
app.use('/api/auth', authRoute);
import messageRoute from './routes/message.route.js'
app.use('/api/messages', messageRoute);


//Middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode:${ process.env.NODE_ENV }/`);
};
//This route handler is a great way to catch all undefined routes and pass them to your error handling middleware. Here’s a quick breakdown:
app.all("*", (req, res, next) => {
    //Create error and send it to error handling middleware
    next(new ApiErrors(`Can't find this route:${req.originalUrl}`, 400));
});

//global middleware for handling error
app.use(globalError)

const SERVER = server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

//Handel rejection outside express
process.on("unhandledRejection", (err) => {
    console.log(`unhandled rejection error: ${err.name} | ${err.message}`);
    SERVER.close(()=>{
        console.log('Shutting down...');
        process.exit(1);
    });
})
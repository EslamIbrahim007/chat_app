import ApiErrors from "../utils/apiErrors.js";

const handleJwtInvalidSignature=()=>{
    new ApiErrors('Invalid token, please try to login again...',401);
};

const handleJwtExpired=()=>{
    new ApiErrors('Expired token, please try to login again...',401);
};

const globalError=(err,req,res,next)=>{
    // Setting default error properties:
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // log the error details for debugging
    console.log(`Error: ${err.message}\n Status: ${err.statusCode}\n Stack: ${err.stack}`);
    //handel the error based in enviroment
    if (process.env.NODE_ENV === 'development'){
        sendErrorForDev(err,req,res,next);
    }else {
        if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if (err.name === 'TokenExpiredError') err = handleJwtExpired();
        sendErrorForProd(err, req, res, next);
    }
};

const sendErrorForDev=(err,req,res,next)=>{
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
    });
};

const sendErrorForProd = (err,req,res,next)=>{
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    });
};


export default globalError;


class ApiErrors extends Error {
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.staus=`${statusCode}`.startsWith(4)?"fail":"error";
        this.isOperational = true;
    }
};
export default ApiErrors;
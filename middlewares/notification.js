class Notification{
    //send success message
    static async _success(res,status,message){
        return res.status(200).json({status: status, message: message});
    }

    //send error message 
    static async error(res,status,message){
        return res.status(400).json({status: status, message:message});
    }
}

module.exports = Notification;
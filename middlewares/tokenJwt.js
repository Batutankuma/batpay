const { decode, sign, verify } = require('jsonwebtoken');


class Authentification {
    //decode jsonWebToken
    decodeToken(key) {
        const id = decode(key,{json:true});
        return id.data;
    }
    //verify json token
    async verifyToken(req,res,next) {
        try {
            const token = req.headers.authorization;
            if (token) {
                const decodedToken = verify(token, process.env.SECRET_KEY);
                const userId = decodedToken.userId;
                if (userId) {
                    throw 'Invalid user ';
                } else {
                    next();
                }
            } else {
                res.status(401).send('Auth token is not found');
            }
        } catch (e) {
            res.status(401).send('Invalid request!');
        }
    }
    //sign token
    signToken(data){
        return sign({data}, process.env.SECRET_KEY,{expiresIn : "720h"});
    }
}

module.exports = Authentification;
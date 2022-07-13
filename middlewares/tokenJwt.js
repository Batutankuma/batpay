const { decode, sign, verify } = require('jsonwebtoken');


class AuthentificationAccess {
    //decode jsonWebToken
    decodeToken(key) {
        const id = decode(req.headers['authorization'],{json:true});
        return id;
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
                res.send('key token is not found');
            }
        } catch (e) {
            res.send('Invalid request!');
        }
    }

    //sign token
    signToken(id){
        return sign({id}, process.env.SECRET_KEY,{expiresIn : 60 * 5});
    }
}

module.exports = AuthentificationAccess;
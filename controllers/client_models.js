const { PrismaClient } = require('@prisma/client');
const {genSaltSync,compareSync,hashSync} = require('bcryptjs');
const Auth = require('../middlewares/tokenJwt');
const Notification = require('../middlewares/notification');
const yup = require('yup');
const Prisma = new PrismaClient();
const {signToken} = new Auth();


class Client {
    //s'inscrire
    async singUp(req, res) {
        try {
            const {firstname,lastname,password,phone,avatar} = req.body;
            
            //hashage de mot de passe
            const salt = genSaltSync(10);
            const passwordHash = hashSync(password,salt);
            if(!passwordHash) throw "Cryptage crash";
            //verification de l'email existance
            const emailExist = await Prisma.clients.findFirst({where:{phone:phone}});
            if(emailExist) throw new Error ("This email address exists");
            // si l'adress email n'existe pas alors enregistre l'utilisateur
            const model = await Prisma.clients.create({ data: {
                firstname: firstname,
                lastname: lastname,
                password: passwordHash,
                phone:phone,
                Comptes:{create:{code: "456",montant: 950}},
                avatar: avatar,
            },include:{Comptes:true}});
            Notification._success(res, 201,{response:model, tokenKey: signToken(model.id)});
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }

    //se connecter
    async loginIn(req, res) {
        try {
            const {password,phone} = req.body;
            if (!password || !phone) throw new Error("Please fill in all fields");
            const phoneExist = await Prisma.clients.findFirst({where:{phone:phone},include:{Comptes:true}});
            if(!phoneExist) throw new Error("Your password or number phone is invalid");
            if(!compareSync(password,phoneExist.password)) throw new Error("Your password or number phone is invalid");
            Notification._success(res, 201,{response:phoneExist, tokenKey: signToken(phoneExist.id)});
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }
    
    // read all client
    async findAll(req, res) {
        try {
            const model = await Prisma.clients.findMany({include:{Comptes:true}});
            console.log(model);
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    // find for id
    async findId(req, res) {
        try {
            const model = await Prisma.clients.findFirst({ where: { id: req.id },include:{Comptes:true} });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //find for phone 
    async findForPhone(req,res){
        try {
            const model = await Prisma.clients.findFirst({where:{
                phone: req.params.phone
            },include:{Comptes:true}});
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message); 
        }
    }
    
    //update for id client
    async updateId(req, res) {
        try {
            const model = await Prisma.clients.update({ where: { id: req.id } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //delete client for id
    async deleteId(req, res) {
        try {
            const model = await Prisma.clients.delete({ where: { id: req.id } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
}

module.exports = Client;
const { PrismaClient } = require('@prisma/client');
const Notification = require('../middlewares/notification');
const yup = require('yup');
const Prisma = new PrismaClient();


class Client {

    //s'inscrire
    async singUp(req, res) {
        try {
            //verification de l'email existance
            const emailExist = await Prisma.clients.findFirst({where:{phone:req.body.phone}});
            if(emailExist) throw new Error ("Email existe, veuillez crée votre nouveau mode de passe");
            // si l'adress email n'existe pas alors enregistre l'utilisateur
            const model = await Prisma.clients.create({ data: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email:req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                Comptes:{create:{code: "456",montant: 950}},
                avatar: req.body.avatar,
            },include:{Comptes:true}});
            Notification._success(res, 201, model);
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }

    //se connecter
    async loginIn(req, res) {
        try {
            const phoneExist = await Prisma.clients.findFirst({where:{phone:req.body.phone},include:{Comptes:true}});
            if(!phoneExist) throw new Error("veuillez verifier votre number or mot de passe");
            if(phoneExist.password != req.body.password) throw new Error("veuillez verifier votre number or mot de passe");
            Notification._success(res, 201, phoneExist);
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }

    // read all client
    async findAll(req, res) {
        try {
            const model = await Prisma.clients.findMany({include:{Comptes:true}});
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

    //find for email
    async findForEmail(req,res){
        try {
            const model = await Prisma.clients.findFirst({where:{
                email: req.params.email
            },include:{Comptes:true}});
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message); 
        }
    }

    async updateId(req, res) {
        try {
            const model = await Prisma.clients.update({ where: { id: req.id } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

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
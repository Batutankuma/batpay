const Auth = require('./../middlewares/tokenJwt');
const { PrismaClient } = require('@prisma/client');
const { compareSync, hashSync, genSaltSync } = require('bcryptjs');
const { signToken,decodeToken } = new Auth();
const Notification = require('../middlewares/notification');
const Prisma = new PrismaClient();

class Developper {
    //s'inscrire
    async singUp(req, res) {
        try {
            const {
                lastname,
                username,
                email,
                avatar,
                password,
            } = req.body;

            const emailExist = await Prisma.developper.findFirst({ where: { email: email } });
            if (emailExist) throw new Error("Email existe, veuillez crée votre nouveau mode de passe");

            //hashage
            const salt = genSaltSync(10);
            const passwordHash = hashSync(password, salt);

            const model = await Prisma.developper.create({
                data: {
                    lastname: lastname,
                    username: username,
                    email: email,
                    avatar: avatar,
                    codeAuth: "",
                    password: passwordHash,
                    Comptes: { create: { montant: 1000, code: "12345" } }
                }, include: {
                    Comptes: true
                }
            });
            await Prisma.developper.update({ where: { id: model.id }, data: { codeAuth: signToken(model.id) } });
            const developper = await Prisma.developper.findFirst({ where: { id: model.id } });
            Notification._success(res, 201, developper);
        } catch (error) {
            console.log(error);
            Notification.error(res, 401, error.message);
        }
    }
    //se connecter
    async loginIn(req, res) {
        try {
            const { email, password } = req.body;
            //hash
            const emailExist = await Prisma.developper.findFirst({ where: { email: email }, include: { Comptes: true } });
            if (!emailExist) throw new Error("veuillez verifier votre number or mot de passe");
            if (!compareSync(password, emailExist.password)) throw new Error("veuillez verifier votre number or mot de passe");
            Notification._success(res, 201, emailExist);
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }
    //find all developper for admin
    async findAll(req, res) {
        try {
            const key = req.params.key;
            const model = await Prisma.developper.findMany({ include: { Comptes: true } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //find developper for id
    async findId(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('verifiez votre key');
            const model = await Prisma.developper.findFirst({ where: { id: key}, include: { Comptes: true } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //find for Username 
    async findForUsername(req, res) {
        try {
            const model = await Prisma.developper.findFirst({
                where: {
                    username: req.params.username
                }, include: { Comptes: true }
            });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //find for email
    async findForEmail(req, res) {
        try {
            const model = await Prisma.developper.findFirst({
                where: {
                    email: req.params.email
                }, include: { Comptes: true }
            });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //update id
    async updateId(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('verifiez votre key');
            const model = await Prisma.developper.update({ where: { id: key} });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //delete for id
    async deleteId(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('verifiez votre key');
            const model = await Prisma.developper.delete({ where: { id: key} });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
}

module.exports = Developper;
const Auth = require('./../middlewares/tokenJwt');
const { PrismaClient } = require('@prisma/client');
const { compareSync, hashSync, genSaltSync } = require('bcryptjs');
const { signToken, decodeToken } = new Auth();
const Notification = require('../middlewares/notification');
const Prisma = new PrismaClient();

class Developper {
    //s'inscrire
    async singUp(req, res) {
        try {
            const { firstname, lastname, password, phone, avatar } = req.body;

            const phoneExist = await Prisma.developper.findFirst({ where: { user: { phone: phone } } });
            if (phoneExist) throw new Error("This number phone exists");

            //hashage
            const salt = genSaltSync(10);
            const passwordHash = hashSync(password, salt);

            const model = await Prisma.developper.create({
                data: {
                    codeAuth: "",
                    user: {
                        create: {
                            firstname: firstname,
                            lastname: lastname,
                            avatar: avatar,
                            phone: phone,
                            password: passwordHash
                        }
                    },
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
            const { phone, password } = req.body;
            //hash
            const phoneExist = await Prisma.developper.findFirst({ where: { user: { phone: phone } }, include: { Comptes: true, user: true } });
            if (!phoneExist) throw new Error("Your password or number phone is invalid");
            if (!compareSync(password, phoneExist.user.password)) throw new Error("Your password or number phone is invalid");
            Notification._success(res, 201, phoneExist);
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }
    //find all developper for admin
    async findAll(req, res) {
        try {
            const key = req.params.key;
            const model = await Prisma.developper.findMany({ include: { Comptes: true, user: true } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //find developper for id
    async findId(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.developper.findFirst({ where: { id: key }, include: { Comptes: true, user: true } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //find for firstnames
    async findForFirstname(req, res) {
        try {
            const model = await Prisma.developper.findFirst({
                where: {
                    user: {
                        firstname: req.params.firstname
                    }
                }, include: { Comptes: true }
            });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //find for phone
    async findForPhone(req, res) {
        try {
            const model = await Prisma.developper.findFirst({
                where: {
                    user: {
                        firstname: req.params.firstname
                    }
                }, include: { Comptes: true, user: true }
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
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.developper.update({ where: { id: key }, data: req.body });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    //delete for id
    async deleteId(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.developper.delete({ where: { id: key } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
}

module.exports = Developper;
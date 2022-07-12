const { PrismaClient } = require('@prisma/client');
const Notification = require('../middlewares/notification');
const Prisma = new PrismaClient();

class entreprise {
    async singUp(req, res) {
        try {
            const emailExist = await Prisma.entreprises.findFirst({ where: { email: req.body.email } });
            if (emailExist) throw new Error("Email existe, veuillez crée votre nouveau mode de passe");
            const model = await Prisma.entreprises.create({
                data: {
                    name: req.body.name,
                    description: `${req.body.description}`,
                    logo: req.body.logo,
                    email: req.body.email,
                    password: req.body.password,
                    username: req.body.username,
                    Comptes: { create: { montant: 1000, code: req.body.name } }
                }, include: {
                    Comptes: true
                }
            })
            Notification._success(res, 201, model);
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }
    async loginIn(req, res) {
        try {
            const emailExist = await Prisma.entreprises.findFirst({ where: { email: req.body.email }, include: { Comptes: true } });
            if (!emailExist) throw new Error("veuillez verifier votre number or mot de passe");
            if (emailExist.password != req.body.password) throw new Error("veuillez verifier votre number or mot de passe");
            Notification._success(res, 201, emailExist);
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }

    async read(req, res) {
        try {
            const model = await Prisma.entreprises.findMany({ include: { Comptes: true } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    async readId(req, res) {
        try {
            const model = await Prisma.entreprises.findFirst({ where: { id: req.id }, include: { Comptes: true } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    async updateId(req, res) {
        try {
            const model = await Prisma.entreprises.update({ where: { id: req.id } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    async deleteId(req, res) {
        try {
            const model = await Prisma.entreprises.delete({ where: { id: req.id } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
}

module.exports = entreprise;
const { PrismaClient } = require('@prisma/client');
const Notification = require('../middlewares/notification');
const Prisma = new PrismaClient();

class Comptes {

    async create(req, res) {
        try {
            const model = new Prisma.comptes.create({ data: req.body });
            Notification._success(res, 201, model);
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }

    async AllId(req, res) {
        try {
            const model = await Prisma.comptes.findMany({ where: { id: req.id } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    async readId(req, res) {
        try {
            const model = await Prisma.comptes.findFirst({ where: { id: req.id } });
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

module.exports = Comptes;
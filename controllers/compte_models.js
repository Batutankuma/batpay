const { PrismaClient } = require('@prisma/client');
const Notification = require('../middlewares/notification');
const Prisma = new PrismaClient();

class Comptes {

    //All operation Developper
    async readForDevelopper(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.comptes.findFirst({ where: { id: key } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    //All client Developper
    async readForClient(req, res) {
        try {
            const model = await Prisma.comptes.findFirst({ where: { id: req.params.id } });
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
const { PrismaClient } = require('@prisma/client');
const Notification = require('../middlewares/notification');
const Prisma = new PrismaClient();

class Relations {

    //add liste favorite
    async add(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.relation.create({
                data:{
                    proprety: key,
                    relation: req.params.ralation
                }
            })
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    //All desactiver
    async delete(req, res) {
        try {
            const model = await Prisma.relation.delete({ where: { id: req.params.id } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    async list(req, res) {
        try {
            const key = decodeToken(req.params.key);
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.relation.findFirst({ where: { proprety: key}, include:{
                relation: true,
                proprety: true
            } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

}

module.exports = Relations;
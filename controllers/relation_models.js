const Auth = require('./../middlewares/tokenJwt');
const Notification = require('../middlewares/notification');
const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();
const { decodeToken } = new Auth();

class Relations {

    //add liste favorite
    async add(req, res) {
        try {
            const key = decodeToken(req.headers.authorization);
            if (!key) throw Error('Check your Auth');
            const proprety = await Prisma.user.findFirst({where:{id: key},include:{Comptes: true}});
            const model = await Prisma.relation.create({
                data:{
                    relationa: proprety.id,
                    relationb: req.params.ralation,
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
            const key = decodeToken(req.headers.authorization);
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.relation.delete({ where: { id: key } });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    async list(req, res) {
        try {
            const key = decodeToken(req.headers.authorization);
            if (!key) throw Error('Check your Auth');
            const model = await Prisma.relation.findMany({ where: { userIdA: key}, include:{
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
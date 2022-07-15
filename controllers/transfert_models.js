const { PrismaClient } = require('@prisma/client');
const Auth = require('./../middlewares/tokenJwt');
const Notification = require('../middlewares/notification');
const {compareSync} = require('bcryptjs');
const {decodeToken} = new Auth();
const Prisma = new PrismaClient();

class Transfert {
    //operation client send developper
    async ForDevelopper(req, res) {
        try {
            const {phone,password,montant} = req.body;
            const {key} = req.params;
            const auth = decodeToken(key);
            const developper = await Prisma.comptes.findFirst({ where: { developperId:auth } });
            const client = await Prisma.comptes.findFirst({ where: { client: { phone: phone } },include:{client:true} });
            if (!client) throw Error("Customer's email or password is invalidated");
            if (!compareSync(password,client.client.password)) throw Error("Customer's email or password is invalidated");
            const montantSend = parseFloat(montant);
            if (parseFloat(client.montant) > montantSend) {
                //reduire le montant dans le compte
                const compteClient = await Prisma.comptes.update({ where: { id: client.id }, data: { montant: parseFloat(client.montant) - parseFloat(montantSend) } });
                const compteDevelopper = await Prisma.comptes.update({ where: { id: developper.id}, data: { montant: (parseFloat(developper.montant) + montantSend) } });
                const model = await Prisma.transfert.create({
                    data: { montant: montantSend, comptesIdA: client.id, comptesIdB: developper.id },
                    include: { compteA: true, compteB: true }
                });
                Notification._success(res, 201, 'Your operation has been successfully completed');
            } else {
                throw new Error("Your amount is insufficient to perform this operation");
            }
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }
    //operation client envoi à un autre client
    async clientForClient(req, res) {
        try {
            const clientA = await Prisma.comptes.findFirst({ where: { client: req.params.id } });
            const clientB = await Prisma.comptes.findFirst({ where: { client: { phone: req.body.phone } } });
            const montantSend = parseFloat(req.body.montant);
            if (parseFloat(clientA.montant) > montantSend) {
                //reduire le montant dans le compte
                const compteClientA = await Prisma.comptes.update({ where: { id: clientA.id }, data: { montant: parseFloat(clientA.montant) - parseFloat(montantSend) } });
                //client receve
                const compteClientb = await Prisma.comptes.update({ where: { id: clientB.id }, data: { montant: (parseFloat(clientB.montant) + montantSend) } });
                const model = await Prisma.transfert.create({
                    data: { montant: montantSend, comptesIdA: clientA.id, comptesIdB: clientB.id },
                    include: { compteA: true, compteB: true }
                });
                Notification._success(res, 201, model);
            } else {
                throw new Error("Your amount is insufficient to perform this operation");
            }
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }
    //read all transfert in system
    async readAll(req, res) {
        try {
            const model = await Prisma.transfert.findMany({
                include:{compteA: true,compteB: false}
            });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    // read all transfert in system 
    async historiqueClientTransfert(req, res) {
        try {
            const model = await Prisma.clients.findFirst({
                where: { id: req.params.id }, include: {
                    Comptes: {include: {RetratsA: true,RetratsB: true}}
                }
            });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
    
    async historiqueDevelopperRecevTransfert(req, res) {
        try {
            const key = decodeToken(req.params.key);
            const developper = await Prisma.comptes.findMany({ where: { developperId:key } });
            const model = await Prisma.transfert.findFirst({where:{comptesIdB: developper.id},include:{
                compteA:true,
                compteB:true
            }});
            Notification._success(res, 200, model);
        } catch (error) {
            console.log(error);
            Notification.error(res, 400, error.message);
        }
    }
}

module.exports = Transfert;
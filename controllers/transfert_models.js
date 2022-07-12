const { PrismaClient } = require('@prisma/client');
const Notification = require('../middlewares/notification');
const Prisma = new PrismaClient();

class Transfert {
    //client send monay entreprise
    async btoc(req, res) {
        try {
            const entreprise = await Prisma.comptes.findFirst({ where: { entreprisesId: req.params.id } });
            const client = await Prisma.comptes.findFirst({ where: { client: { phone: req.body.phone } } });
            const montantSend = parseFloat(req.body.montant);
            if (parseFloat(client.montant) > montantSend) {
                //reduire le montant dans le compte
                const compteClient = await Prisma.comptes.update({ where: { id: client.id }, data: { montant: parseFloat(client.montant) - parseFloat(montantSend) } });
                const compteEntreprise = await Prisma.comptes.update({ where: { id: entreprise.id }, data: { montant: (parseFloat(entreprise.montant) + montantSend) } });
                const model = await Prisma.transfert.create({
                    data: { montant: montantSend, comptesIdA: client.id, comptesIdB: entreprise.id },
                    include: { compteA: true, compteB: true }
                });
                Notification._success(res, 201, model);
            } else {
                throw new Error("Votre montant est insufissant pour effectuer cette operation");
            }
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }
    //client envoi à un autre client
    async ctoc(req, res) {
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
                throw new Error("Votre montant est insufissant pour effectuer cette operation");
            }
        } catch (error) {
            Notification.error(res, 401, error.message);
        }
    }

    //read all transfert in system
    async readAll(req, res) {
        try {
            const model = await Prisma.transfert.findMany();
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
                    Comptes: {
                        include: {
                            RetratsA: true,
                            RetratsB: true
                        }
                    }
                }
            });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }

    async historiqueEntrepriseTransfert(req, res) {
        try {
            const model = await Prisma.entreprises.findFirst({
                where: { id: req.params.id }, include: {
                    Comptes: {
                        include: {
                            RetratsA: true,
                            RetratsB: true
                        }
                    }
                }
            });
            Notification._success(res, 200, model);
        } catch (error) {
            Notification.error(res, 400, error.message);
        }
    }
}

module.exports = Transfert;
import { Router } from "express";
import Controller from '../controllers/user.controller.js'
import config from "../config.js";
import nodemailer from 'nodemailer';

const router = Router();
const controller = new Controller();

const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:config.GMAIL_APP_USER,
        pass:config.GMAIL_APP_PASS
    }
})


/*
router.get('/', async(req,res) =>{
    try{
        res.status(200).send({ status:'ok', data: await controller.get()});
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})*/

router.get('/', async(req, res) =>{
    try{
        const data = await controller.getSelect()
        res.status(200).send({status:'ok', data: data})
    }catch{

    }
})

router.post('/', async(req,res) =>{
    try{
        const process = await controller.add(req.body);

        res.status(200).send({ status:'ok', data: process});
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})

router.put('/:id', async(req,res) =>{
    try{
        const filter = {_id: req.params.id };
        const update = req.body;
        const options = {new: true };
        const process = await controller.update(filter, update, options)
        res.status(200).send({ status:'ok', data: process});
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})

router.delete('/:id', async(req,res) =>{
    try{
        res.status(200).send({ status:'ok', data: await controller.delete()});
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})

router.post('/delete', async (req, res) =>{
    try{
        const { userId } = req.body;

        if(userId){
            await controller.delete(userId)
            res.status(200).json({ message: "usuario eliminado correctamente"});
        }else{
            res.status(500).send({ origin: config.SERVER, payload: null, error: "eror"});
        }
    }catch{
        console.error('error al eliminar el usuario',error);
        res.status(500).json({error: 'error al eliminar el usuario'})
    }
})

router.post('/changeRole', async(req,res) =>{
    try{
        const {rol , userId} = req.body;

        if(rol && userId){
            const filter = {_id: userId};
            const update = {role: rol};

            await controller.update(filter,update)
            res.status(200).send({origin: config.SERVER, payload: "rol cambiado con exito ",})
        }else{
            res.status(500).send({ origin: config.SERVER, payload: null, error: "error al cambiar el rol del usuario"});
        }
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})

router.delete('/deleteInactive', async (req,res) =>{
    const limitDate = newDate();
    limitDate.setDate(limitDate.getDate()- 2);

    try{

        //buscar usuario que no se haya conectado en 2 dias
        const result = await controller.deleteMany({ lastLogin: { $lt: twoDaysAgo } });
        console.log(`Usuarios eliminados: ${result.deletedCount}`);
        
        
        
        const mail = await transport.sendMail({
            from:`propietario de la pagina <${config.GMAIL_APP_USER}`,
            to: result.email,
            subject: 'cuenta suspendida',
            html:'<p> debido a la inactividad de la cuenta, la misma fue suspendida </p>'
        })

        return result.deletedCount;
    } catch(err){
        console.error('error al eliminar usuarios inactivos')
        res.status(500).json({error: 'error al eliminar usuarios inactivos'});
    }
});

export default router;
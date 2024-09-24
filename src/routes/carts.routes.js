import { Router } from "express";
import Controller from "../controllers/carts.controller.js"
import nodemailer from 'nodemailer';
import  config  from "../config.js";
import mongoose from "mongoose";

const router = Router();
const controller = new Controller();
/*const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user: config.GMAIL_APP_USER,
        pass: config.GMAIL_APP_PASS
    }
})
*/

router.get('/mail', async(req,res) =>{
    try{
        const confirmation = await transport.sendMail({
            from: `programador estudiante <${config.GMAIL_APP_USER}>`,
            to:'correo ficticio @gmail.com',
            subject:'intento de mailing',
            html:'<h1> texto de prueba </h1>'
        })
        res.status(200).send({status:"ok", data: confirmation})
    }catch(err){
        res.status(500).send({status: 'err', data: err.message})
    }
})

router.get('/', async (req, res) =>{
    try{
        res.status(200).send({ status: 'ok' , data: await controller.get() });
    }catch(err){
        res.status(500).send({ status: 'err', data: err.message });
    }
})

router.get('/one/:cid', async (req, res) =>{
    try{
        const process = await controller.getById(req.params.cid)
        res.status(200).send({ status: 'ok' , data: process });
    }catch(err){
        res.status(500).send({ status: 'err', data: err.message });
    }
})

router.post('/', async(req,res) =>{
    try{
        const process = await controller.add(req.body)
        res.status(200).send({ status:'ok', data: process});
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})

router.post('/add', async (req,res) =>{
    try{
        //llegan los ids del producto y del user 
        const {productId} = req.body;
        const userId = req.session.user._doc._id;
        

        if( userId && productId){
            console.log(` IDs correctos: user id: ${userId}, product id ${productId}`)
        }

        const productObjectId = new mongoose.Types.ObjectId(productId);


        //corrobora que exista el carrito del usuario
        const cart = await controller.getOne({_user_id: userId});
        console.log("carrito encontrado",cart)
        
        if(!cart) {
            //si el carrito del usuario no existe se crea
            console.log("el carrito no existe, creando uno nuevo...")
            cart = await controller.add({
                _user_id: userId,
                products: [{_id: productId, qty:1}]
            });
            console.log("carrito creado",cart)
        }else{
            //si el carrito del usuario existe se busca el producto en el carrito 
            console.log("el carrito existe")
            const productIndex = cart.products.findIndex(product => 
                product._id && product._id.equals ? product._id.equals(productObjectId) : product._id._id.equals(productObjectId)
            );
            console.log(productIndex)
            if(productIndex === -1){
                //si el producto no se encuentra en el carrito  se agrega
                
                const filter = {_user_id: userId};
                const update = {$push: { products: {_id: productId, qty: 1}}};
                const options = {new: true};

                const updatedCart = await controller.update(filter,update,options)
                console.log("producto agregado al carrito", updatedCart);  
            }else{
                //si el producto existe en el carrito se agrega una unidad mas a cantidad
                const filter = {_user_id: userId, 'products._id': productId};
                const update = {$inc: { 'products.$.qty':1}}; 
                const options = {new: true};
                const process = await controller.update(filter, update,options)
                console.log("cantidad del producto incrementada", process)
            }
        
        }
        res.status(200).json({ message: "producto agregado al carrito"});
    }catch(error){
        console.error('error al agregar producto al carrito',error);
        res.status(500).json({error: 'error al agregar el producto al carrito'})
    }
})

router.put('/:id', async(req,res) =>{
    try{
        const filter = {_id: req.params.id };
        const update = req.body;
        const options = {new: true};
        const process = await controller.update(filter, update, options)
        res.status(200).send({ status:'ok', data: process});
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})

router.delete('/:cid', async(req,res) =>{
    try{
        const filter = {_id: req.params.cid}
        const process = await controller.delete(filter)
        res.status(200).send({ status:'ok', data: process});
    }catch(err){
        res.status(500).send({ status:'err', data: err.message});
    }
})

router.delete('/:cid/products', async (req, res) =>{
    try{
        const filter = {_id: req.params.cid};
        const update = {"id": filter, "products": []}
        const options = { new: true };
        const process = await controller.deleteProducts(filter, update, options)

        res.status(200).send({ origin: config.SERVER, payload: process });
    }catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
})

router.delete('/:cid/products/:pid',async (req, res) =>{
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const process= await controller.deleteOneProduct(cid,pid)
        
        res.status(200).send({origin: config.SERVER,  payload: process});
        
    }catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
})

router.post('/delete', async (req,res) =>{
    try{
        //llegan los ids del producto y del user
        
        const { productId } = req.body;
        const userId = req.session.user._doc._id;

        if( userId && productId){
            console.log(`IDs correctos: user id: ${userId}, product id: ${productId}`)
        }

        const productObjectId = new mongoose.Types.ObjectId(productId);

        //se busca el carrito del usuario
        const cart = await controller.getOne({_user_id: userId});

        

        //se busca el indice del producto en el carrito 
        const productIndex = cart.products.findIndex(product => product._id && product._id.equals ? product._id.equals(productObjectId) : product._id._id.equals(productObjectId));

        if(productIndex === -1){
            return res.status(404).json({ error: 'producto no encontrado en el carrito' });
        }
        const product = cart.products[productIndex];

        if(product.qty >= 2) {
            const filter = {_user_id: userId, 'products._id': productObjectId};
            const update = {$inc: { 'products.$.qty':-1}}; 

            await controller.update(filter, update);
        }else{
            const filter = {_user_id: userId};
            const update = {$pull: {products: {_id: productObjectId}}};
            await controller.update(filter,update);
        }

        res.status(200).json({ message: "producto actualizado correctamente"});
        

    }catch(error){
        console.error('error al eliminar producto del carrito',error);
        res.status(500).json({error: 'error al eliminar el producto del carrito'})
    }
})



export default router;

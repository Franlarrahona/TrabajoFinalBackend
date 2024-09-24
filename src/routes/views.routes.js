import { Router } from "express";
import config from "../config.js";
import UserController from "../controllers/user.controller.js";
import ProductsController from "../controllers/products.controller.js";
import CartsController from "../controllers/carts.controller.js";
import { verifyToken, createToken, adminAuth } from "../services/utils.js";
import mongoose from "mongoose";


const router = Router();
const productsController = new ProductsController()
const cartsController = new CartsController()
const userController = new UserController()

router.get('/products/:page', async (req, res) => {
    const data = await productsController.get(config.PRODUCTS_PER_PAGE, req.params.page)
    if (!req.session.user) return res.redirect('/login');
    res.render('products', { data: data , user:req.session.user });
})

/*router.get("/products", async  (req, res) => {
    const products = await controller.get()
    if (!req.session.user) return res.redirect('/login');
    res.render('products', {products:products, user:req.session.user })
})*/

router.get("/login", async (req,res) =>{
    if (req.session.user) return res.redirect('/profile');
    res.render('login', {})
})

router.get('/profile', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    const user = await req.session.user;
    res.render('profile', { user: user});
});

router.get('/register', (req, res) =>{
    res.render('register',{})
})

router.get('/changePassword', (req,res) =>{
    res.render('changePassword',{})
})

router.get('/changePassword3',verifyToken, (req,res) =>{
    const userData = req.user;
    res.render('changePassword3',{userData})
})

router.get('/upload', (req,res) =>{
    res.render('upload',{})
})

router.get('/cart',  async (req,res) =>{
    if (!req.session.user) return res.redirect('/login');
    
    const userId = req.session.user._doc._id;
    const objectId = new mongoose.Types.ObjectId(userId);
    
    const data = await cartsController.getOne({_user_id:objectId})

    res.render('cart',{ data: data , user:req.session.user })
})

router.get('/buy', async (req,res) =>{
    if (!req.session.user) return res.redirect('/login');

    const userId = req.session.user._doc._id;
    const objectId = new mongoose.Types.ObjectId(userId);
    
    const data = await cartsController.getOne({_user_id:objectId})

    data.products.forEach(product =>{
        product.subtotal = product._id.precio * product.qty;
    });

    let total = 0;
    data.products.forEach(product =>{
        total += product.subtotal;
    })
    
    res.render('buy',{data:data , total:total})
})

router.get('/usersManager/:page', adminAuth, async (req,res) =>{
    try{
        const data = await userController.getSelect()
        const plainData = data.map(user => user.toObject())
        res.render('usersManager', {data: plainData} )
    } catch(error){
        res.status(500).send({message: "Error al mostrar los usuarios"});
    }
    
})




export default router
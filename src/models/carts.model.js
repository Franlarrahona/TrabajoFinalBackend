import mongoose, { mongo } from "mongoose";

import userModel from "./users.model.js";
import productModel from "./products.model.js";

mongoose.pluralize(null);

const collection = 'carts';

const schema  = new mongoose.Schema({

    _user_id: {type: mongoose.Schema.Types.ObjectId, required:true, ref:'users_index'},
    //products: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'products'}
    products: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },  // Cada producto tiene un ObjectId que referencia al modelo de productos
            qty: { type: Number, required: true }  // Cantidad de cada producto en el carrito
        }
    ]
})

const autoPopulate = function (next) {
    this.populate({ path: '_user_id', model: userModel});
    this.populate({ path: 'products._id', model: productModel});
    next();
}

schema.pre('find', autoPopulate);
schema.pre('findOne', autoPopulate);

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;
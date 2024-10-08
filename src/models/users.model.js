import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null);

const collection = 'users_index';


const schema = new mongoose.Schema({
    firstName: {type: String, required:true },
    lastName: {type: String, required:true },
    email: {type:String, required: true },
    password: {type: String, required:true},
    role: {type: String, enum:['admin','premium','user'], default: 'user'},
    lastLogin: { type:Date,default: Date.now }
});


const model = mongoose.model(collection, schema);

export default model;
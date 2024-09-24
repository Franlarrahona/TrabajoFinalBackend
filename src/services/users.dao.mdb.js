import usersModel from '../models/users.model.js';

class usersService {
    constructor(){

    }
    async get(){
        try{
            return await usersModel.find().lean()
        }catch(err){
            return err.message
        }
    }
    async getSelect(){
        try{
            return await usersModel.find().select('firstName lastName email role _id  ')
        }catch(err){
            return err.message
        }
    }
    async getById(id){
        try{
            return await usersModel.findById(id).lean()
        }catch(err){
            return err.message;
        }
    }
    async getOne(filter){
        try{
            return await usersModel.findOne(filter)
        }catch(err){
            return err.message
        }
    }
    async add(newData){
        try{
            return await usersModel.create(newData);
        }catch(err){
            return err.message
        }
    }
    async update(filter,update,options){
        try {
            return await usersModel.findOneAndUpdate(filter, update, options);
        } catch (err) {
            return err.message;
        };
    }

    async delete(filter){
        try{
            return await usersModel.findOneAndDelete(filter);
        }catch(err){
            return err.message
        }
    }
    async deleteMany(filter){
        try{
            return await usersModel.deleteMany(filter);
        }catch(err){
            return err.message
        }
    }
}

export default usersService;

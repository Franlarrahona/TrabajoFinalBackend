import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config.js'
import MongoSingleton from '../services/mongo.singleton.js';


//bcrypt functions

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToVerify, storedHash) => bcrypt.compareSync(passwordToVerify, storedHash);

export const createToken = (payload, duration) => {
    const token = jwt.sign(payload, config.SECRET, { expiresIn: duration})
    return token;
};


export const verifyToken = (req,res, next) => {
    //extraer el token desde el header authorization
    const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1]: undefined;
    //extraer el token desde las cookies
    const cookieToken = req.cookies && req.cookies[`${config.APP_NAME}_cookie`]? req.cookies[`${config.APP_NAME}_cookie`]: undefined;
    //extraer el token en los query params
    const queryToken = req.query.token ? req.query.token: undefined;
    // guarda el toquen desde donde alla llegado
    const receivedToken = headerToken || cookieToken || queryToken;

    if (!receivedToken) return res.status(401).send('Token no proporcionado');
    
    try{
        jwt.verify(receivedToken, config.SECRET, (err, payload) =>{ 
            if (err) return res.status(403).send({ origin: config.SERVER, payload: 'Token no válido' });
            req.user = payload;
            next()
        });
    }catch(err){
        res.status(403).send("token invalido o expirado")
    }
}


export const verifyRequiredBody = (requiredFields) => {
    return (req, res, next) => {
        const allOk = requiredFields.every(field => 
            req.body.hasOwnProperty(field) && req.body[field] !== '' && req.body[field] !== null && req.body[field] !== undefined
        );
        
        if (!allOk) return res.status(400).send({ origin: config.SERVER, payload: 'Faltan propiedades', requiredFields });
        next();
    };
};


export const handlePolicies = policies => {
    return async (req, res, next) => {
        console.log(req.user);
        if (!req.user) return res.status(401).send({ origin: config.SERVER, payload: 'Usuario no autenticado' });
        if (policies.includes(req.user.role)) return next();
        res.status(403).send({ origin: config.SERVER, payload: 'No tiene permisos para acceder al recurso' });
    }
}



export const adminAuth = (req,res, next) =>{
    
    if (!req.session.user) {
        return res.status(401).send({origin: config.SERVER, payload: "Usuario no autenticado"});
    }
    if(req.session.user._doc.role !== 'admin'){
        return res.status(401).send({origin: config.SERVER, payload:"acceso denegado"})
    }
    next();
}



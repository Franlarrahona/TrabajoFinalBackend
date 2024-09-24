import { Router } from "express";

import { uploader } from "../services/uploader.js";
import config from '../config.js'

const router = Router();


router.post('/products', uploader.array('productImages', 3),(req, res) =>{
    res.status(200).send({ status: "OK", payload: "imagenes subidas", files: req.files});
});

router.post('/profiles', uploader.array('profileImages', 2),(req, res) =>{
    res.status(200).send({ status: "OK", payload: "imagenes subidas", files: req.files});
});

router.post('/documents', uploader.array('documentsImages', 3),(req, res) =>{
    res.status(200).send({ status: "OK", payload: "imagenes subidas", files: req.files});
});

export default router
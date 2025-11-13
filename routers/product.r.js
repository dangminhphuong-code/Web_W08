import express from "express";
import { getAllProducts, getProductById, getProductsAjax } from "../controllers/product.c.js";
//create a router
const router = express.Router();
//Rooute to get all products
router.get('/', getAllProducts);

//route to get a single product ID
router.get('/:id', getProductById);
router.post('/ajax', getProductsAjax);
export default router;
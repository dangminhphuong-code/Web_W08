import { getAjaxPage, getAllProductsAndCategories, getPaginatedProductsAndCategories, postAjaxPage } from "../controllers/home.c.js";

import express from "express";
const router = express.Router();
router.get("/", getAllProductsAndCategories);
router.get('/ajax', getAjaxPage);
router.post('/ajax', postAjaxPage);
router.get('/:page', getPaginatedProductsAndCategories);
export default router;
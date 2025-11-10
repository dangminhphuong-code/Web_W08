import { getAllProductsOfCategory } from "../controllers/category.c.js";
import express from "express";
const router = express.Router();

router.get('/:category', getAllProductsOfCategory);
export default router;
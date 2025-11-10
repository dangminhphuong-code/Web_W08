import { getAllProductsAndCategories } from "../controllers/home.c.js";

import express from "express";
const router = express.Router();
router.get("/", getAllProductsAndCategories);

export default router;
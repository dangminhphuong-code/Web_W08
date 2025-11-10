import categoryM from "../models/category.m.js";
import productM from "../models/product.m.js";

export const getAllProductsOfCategory = async (req, res) => {
    const category = req.params.category;
    const categories = await categoryM.all();
    categories.find(c => c.name === category).current =true;
    const products = await productM.allOfCategory(category);
    res.render("product/products",{products,categories, category});
};
import categoryM from "../models/category.m.js";
import productM from "../models/product.m.js";

export const getAllProductsAndCategories = async (req, res) => {
  const products = await productM.all();
  const categories = await categoryM.all();
  res.render("product/products", { products, categories });
};

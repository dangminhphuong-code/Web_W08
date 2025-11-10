import productM from "../models/product.m.js";
import categoryM from "../models/category.m.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await productM.all();
    const categories = await categoryM.all();
    res.render("product/products", { products, categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productM.one(productId);
    const categories = await categoryM.all();

    if (product) {
      res.render("product/productDetail", { product, categories });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

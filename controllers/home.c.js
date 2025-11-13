import categoryM from "../models/category.m.js";
import productM from "../models/product.m.js";

export const getAllProductsAndCategories = async (req, res) => {
  const products = await productM.all();
  const categories = await categoryM.all();
  res.render("product/products", { products, categories });
};
const pageSize = 3;
export const getPaginatedProductsAndCategories = async(req, res)=>{
  const {page} = req.params;
  const {products, toal, safePage, safePageSize} = await productM.allWithPagination(page, pageSize);
  const totalPages = Math.ceil(total / safePageSize);
  const categories = await categoryM.all();
  res.render("product/productsWithPaging", {products, categories, totalPages, page: safePage, enablePrev: safePage > 1 && totalPages > 1, enableNext: safePage < totalPages && totalPages > 1});
};
export const getAjaxPage = async (req, res) =>{
  const categories = await categoryM.all();
  console.log(1);
  res.render("product/productsAjaxPaging", {categories});
};
export const postAjaxPage = async(req, res)=>{
  const {page, pageSize} = req.body;
  const {products, total, safePage, safePageSize} = await productM.allWithPagination(page, pageSize);
  const totalPages = Math.ceil(total / safePageSize);
  res.json({products, totalPages, page : safePage});
}

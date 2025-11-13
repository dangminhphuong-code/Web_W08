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
export const getProductsAjax = async (req, res) => {
    try {
        // 1. Lấy số trang từ body của request
        // (Vì client-side của bạn dùng method: 'POST' và body: JSON.stringify({ page }))
        const page = req.body.page || 1; 

        // 2. Gọi hàm model đã sửa (ở đoạn chat trước)
        // Hàm này sẽ trả về { products, page, totalPages }
        const data = await productM.allWithPagination(page);

        // 3. Trả về dữ liệu JSON cho client-side
        res.json(data);

    } catch (error) {
        // 4. Đây là chìa khóa!!
        // Nếu có lỗi 500, lỗi sẽ in ra ở Terminal của bạn
        console.error("Lỗi 500 khi lấy AJAX:", error); 
        
        res.status(500).json({ error: "Failed to fetch paginated products" });
    }
};

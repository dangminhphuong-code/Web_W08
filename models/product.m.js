import db from'./db.js';
const TABLE_NAME = 'products';
export default {
    all:async  ()=> {
        return await db(TABLE_NAME).select('*');
    },
    one:async (id)=> {
        const product = await db(TABLE_NAME).select('*').where({id}).first();
        return product;
    },
    add:async (newProduct) => {
        const [id] = await db(TABLE_NAME).insert(newProduct).returning('id');
        return id;
    },
    allOfCategory: async(category) => {
        return await db(TABLE_NAME).select('*').where({category_id:category});
    },

    //Retrieve products with pagination
    allWithPagination: async (page = 1, pageSize = 3) => {
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safePageSize = Math.max(1, parseInt(pageSize,10) || 3);
        const offset = (safePage - 1) * safePageSize;

        const totalAllProducts = db(TABLE_NAME).count('id as total').first();
        const paginatedProducts = db(TABLE_NAME).select('*').orderBy('id',
            'asc').limit(safePageSize).offset(offset);
            const [total, products] = await Promise.all([totalAllProducts, paginatedProducts]);

            return {products, safePage, safePageSize, total: total.total};
    },
}
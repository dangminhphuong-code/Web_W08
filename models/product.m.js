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
    }
}
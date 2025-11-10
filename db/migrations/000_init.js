export async function up(knex) {
  // Bảng cha trước: categories
  await knex.schema.createTable('categories', (t) => {
    // Dùng identity để tiện auto-increment về sau; vẫn có thể insert id thủ công
    t.increments('id').primary();
    t.string('title', 120).notNullable();
    t.unique(['title']);
  });

  // Bảng con: products
  await knex.schema.createTable('products', (t) => {
    t.increments('id').primary();
    t.string('title', 255).notNullable();
    t.decimal('price', 10, 2).notNullable();
    t.text('description').notNullable();
    t.decimal('rating_rate', 3, 1).notNullable();
    t.integer('rating_count').notNullable();

    // FK đến categories
    t.integer('category_id')
      .notNullable()
      .references('id')
      .inTable('categories')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');

    // Index thực tiễn
    t.index(['category_id'], 'idx_products_category');
    t.index(['rating_rate'], 'idx_products_rating_rate');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
}

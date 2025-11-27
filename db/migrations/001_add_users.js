export async function up(knex) {
    await knex.schema.createTable('users', (t) => {
        t.increments('id').primary();
        t.string('username', 50).notNullable().unique();
        t.string('name', 120).notNullable();
        t.string('email', 255).notNullable().unique();
        t.string('password', 255).notNullable();
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('users');
}
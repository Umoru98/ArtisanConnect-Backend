
export async function up(knex) {
  await knex.schema.createTable('services', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
  });
}

export async function down(knex) {
  await knex.schema.dropTable('services');
}

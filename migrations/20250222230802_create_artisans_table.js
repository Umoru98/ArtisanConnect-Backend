
export async function up(knex) {
  await knex.schema.createTable('artisans', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.integer('service_id').unsigned().notNullable()
      .references('id').inTable('services').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('artisans');
}

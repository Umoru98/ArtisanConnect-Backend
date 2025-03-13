
export async function up(knex) {
  await knex.schema.createTable('appointments', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('artisan_id').unsigned().notNullable()
      .references('id').inTable('artisans').onDelete('CASCADE');
    table.integer('service_id').unsigned().notNullable()
      .references('id').inTable('services').onDelete('CASCADE');
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.integer('status_id').unsigned().notNullable()
      .references('id').inTable('statuses').onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('appointments');
}

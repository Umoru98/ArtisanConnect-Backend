
export async function up(knex) {
  await knex.schema.createTable('statuses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable(); 
  });

  // Optionally, seed initial statuses
  await knex('statuses').insert([
    { name: 'booked' },
    { name: 'completed' },
    { name: 'declined' }
  ]);
}

export async function down(knex) {
  await knex.schema.dropTable('statuses');
}

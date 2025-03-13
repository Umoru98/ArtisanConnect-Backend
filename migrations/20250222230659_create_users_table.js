
export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').unique().notNullable();
    table.string('phone').unique().notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true); 
  });
}

export async function down(knex) {
  await knex.schema.dropTable('users');
}

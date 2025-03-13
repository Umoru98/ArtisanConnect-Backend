
export async function up(knex) {
  const hasEmail = await knex.schema.hasColumn('artisans', 'email');
  if (!hasEmail) {
    await knex.schema.alterTable('artisans', (table) => {
      table.string('email').unique().notNullable();
    });
  }

  const hasPhone = await knex.schema.hasColumn('artisans', 'phone');
  if (!hasPhone) {
    await knex.schema.alterTable('artisans', (table) => {
      table.string('phone').unique().nullable();
    });
  }

  const hasPassword = await knex.schema.hasColumn('artisans', 'password');
  if (!hasPassword) {
    await knex.schema.alterTable('artisans', (table) => {
      table.string('password').notNullable();
    });
  }
}

export async function down(knex) {
  await knex.schema.alterTable('artisans', (table) => {
    table.dropColumn('email');
    table.dropColumn('phone');
    table.dropColumn('password');
  });
}

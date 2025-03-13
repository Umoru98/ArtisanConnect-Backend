export async function up(knex) {
  const hasAppointmentDate = await knex.schema.hasColumn('appointments', 'appointment_date');
  if (hasAppointmentDate) {
    await knex.schema.alterTable('appointments', (table) => {
      table.dropColumn('appointment_date');
    });
  }
  
  const hasStartTime = await knex.schema.hasColumn('appointments', 'start_time');
  const hasEndTime = await knex.schema.hasColumn('appointments', 'end_time');
  
  if (!hasStartTime) {
    await knex.schema.alterTable('appointments', (table) => {
      table.timestamp('start_time').notNullable();
    });
  }
  
  if (!hasEndTime) {
    await knex.schema.alterTable('appointments', (table) => {
      table.timestamp('end_time').notNullable();
    });
  }
}

export async function down(knex) {
  const hasStartTime = await knex.schema.hasColumn('appointments', 'start_time');
  if (hasStartTime) {
    await knex.schema.alterTable('appointments', (table) => {
      table.dropColumn('start_time');
    });
  }
  
  const hasEndTime = await knex.schema.hasColumn('appointments', 'end_time');
  if (hasEndTime) {
    await knex.schema.alterTable('appointments', (table) => {
      table.dropColumn('end_time');
    });
  }
  
  const hasAppointmentDate = await knex.schema.hasColumn('appointments', 'appointment_date');
  if (!hasAppointmentDate) {
    await knex.schema.alterTable('appointments', (table) => {
      table.timestamp('appointment_date').notNullable();
    });
  }
}

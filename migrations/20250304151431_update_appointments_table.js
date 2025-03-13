export async function up(knex) {
  await knex.schema.alterTable("appointments", (table) => {
    table.dropColumn("start_time");
    table.dropColumn("end_time");
    table.timestamp("appointment_date").notNullable();

    table.dropForeign(["status_id"]); 
    table.dropColumn("status_id"); 
    table
      .enum("status", ["pending", "accepted", "declined"])
      .defaultTo("pending");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("appointments", (table) => {
    table.dropColumn("appointment_date");

    table.integer("status_id").unsigned().notNullable();
    table
      .foreign("status_id")
      .references("id")
      .inTable("statuses")
      .onDelete("CASCADE");

    table.timestamp("start_time").notNullable();
    table.timestamp("end_time").notNullable();
  });
}

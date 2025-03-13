// seeds/20250222230000_statuses_seed.js

export async function seed(knex) {
  // Optionally, delete all existing entries (be careful with this in production)
  await knex('statuses').del();

  // Insert seed entries
  await knex('statuses').insert([
    { name: 'pending' },
    { name: 'booked' },
    { name: 'accepted' },
    { name: 'declined' },
    { name: 'completed' }
  ]);
}

export async function seed(knex) {
  await knex('services').del();
  
  await knex('services').insert([
    { name: 'Plumbing' },
    { name: 'Carpentry' },
    { name: 'Tailoring' },
    { name: 'Electrician' },
    { name: 'Painting' }
  ]);
}

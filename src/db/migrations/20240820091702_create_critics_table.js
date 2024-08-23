exports.up = function(knex) {
    return knex.schema.createTable('critics', (table) => {
        table.increments('critic_id').primary(); // Primary key
        table.string('preferred_name'); // Preferred first name
        table.string('surname'); // Last name
        table.string('organization_name'); // Organization name
        table.timestamps(true, true); // created_at and updated_at fields
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('critics');
};
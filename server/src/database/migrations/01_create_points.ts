import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
        table.string('services').notNullable();
        table.string('address').notNullable();
        table.string('phone').notNullable();
        table.boolean('is_paid').notNullable();
        table.string('seller').notNullable();
        table.string('plan').notNullable();
        table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    })
};

export async function down(knex: Knex) {
    return knex.schema.dropTable('points');
};
    
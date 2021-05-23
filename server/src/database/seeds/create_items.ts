import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: 'Hospital PET', image: 'hospital.svg'},
        { title: 'Clínica PET', image: 'clinic.svg'},
        { title: 'Pet Shop', image: 'shop.svg'},
        { title: 'Lojas', image: 'store.svg'},
        { title: 'Aviários', image: 'aviary.svg'},
        { title: 'Vacinação', image: 'vaccine.svg'},
        { title: 'Hotel PET', image: 'hostel.svg'},
        { title: 'ONGs', image: 'ong.svg'},
        { title: 'Pontos de adoção', image: 'adoption.svg'},
    ])
}
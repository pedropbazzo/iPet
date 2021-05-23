require("dotenv").config();

import knex from 'knex';

const connection = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        ssl: {
            rejectUnauthorized: false
          } 
    },
    useNullAsDefault: true
})

export default connection;
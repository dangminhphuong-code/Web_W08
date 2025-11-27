import db from './db.js';
const TABLE_NAME = 'users';

export default {
    // Retrieve all users
    all: async () => {
        return await db(TABLE_NAME).select('*');
    },
    // Retrieve a single user by id
    oneById: async (id) => {
        const user = await db(TABLE_NAME).select('*').where({ id }).first();
        return user;
    },
    // Retrieve a single user by username
    oneByUsername: async (username) => {
        const user = await db(TABLE_NAME).select('*').where({ username }).first();
        return user;
    },
    // Add a new user
    add: async (newUser) => {
        const [id] = await db(TABLE_NAME).insert(newUser).returning('id');
        return id;
    }
};
const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { v4: uuid } = require('uuid');
const { exec } = require('child_process');
const path = require('path');
const testDb = require('./testDb');

require('dotenv').config({
    path: path.resolve('./.test.env'),
});


class CustomEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
        this.schema = `test_menuapp_${uuid().replace(/-/g, '_')}`;
        this.connectionString = `${process.env.DATABASE_URL}${this.schema}`;
    }

    async setup() {
        process.env.DATABASE_URL = this.connectionString;
        this.global.process.env.DATABASE_URL = this.connectionString;

        testDb.createTestDatabase(this.schema);
        await new Promise((resolve) => {
            exec(`ts-node-dev database/migrate.ts`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Migration failed:', error);
                }
                resolve();
            });
        });
    }

    async teardown() {
        testDb.dropTestDatabase(this.schema);
    }
}

module.exports = CustomEnvironment;

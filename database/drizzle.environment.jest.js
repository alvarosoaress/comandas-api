const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { v4: uuid } = require('uuid');
const path = require('path');
const testDb = require('./testDb');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.test.env'),
});

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.schema = `test_menuapp_${uuid().replace(/-/g, '_')}`;
    this.connectionString = `${process.env.DATABASE_URL_TEMPLATE}${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await testDb.createTestDatabase(this.schema);
  }

  async teardown() {
    await testDb.dropTestDatabase(this.schema);
  }
}

module.exports = CustomEnvironment;

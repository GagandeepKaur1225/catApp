import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import User from './models/user';
import schema from './models/schema';
const adapter = new SQLiteAdapter({
  dbName: 'cricHeroes',
  schema,
});

const database = new Database({
  adapter,
  modelClasses: [User],
});

export default database;

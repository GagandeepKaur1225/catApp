import { appSchema, tableSchema } from '@nozbe/watermelondb';
export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'userName', type: 'string' },
        { name: 'phoneNumber', type: 'number' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
        { name: 'profilePicture', type: 'string' },
      ],
    }),
  ],
});

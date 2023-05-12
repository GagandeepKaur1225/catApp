import { appSchema, tableSchema } from '@nozbe/watermelondb';
export default appSchema({
  version: 5,
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
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'text', type: 'string' },
        { name: 'sentAt', type: 'number' },
        { name: 'idMessage', type: 'string' },
        { name: 'sender', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'receiverId', type: 'string' },
      ],
    }),
  ],
});

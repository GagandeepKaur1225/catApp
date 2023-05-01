import { field, writer } from '@nozbe/watermelondb/decorators';

import { Model } from '@nozbe/watermelondb';

export default class User extends Model {
  static table = 'users';
  @field('userName') userName;
  @field('phoneNumber') phoneNumber;
  @field('email') email;
  @field('password') password;
  @field('profilePicture') profilePicture;
  @writer async addUser(
    userName,
    phoneNumber,
    email,
    password,
    profilePicture,
  ) {
    await this.create(item => {
      item.userName = userName;
      item.phoneNumber = phoneNumber;
      item.email = email;
      item.password = password;
      item.profilePicture = profilePicture;
    });
  }
}

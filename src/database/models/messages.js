import { field, writer } from '@nozbe/watermelondb/decorators';

import { Model } from '@nozbe/watermelondb';

export default class Messages extends Model {
  static table = 'messages';
  @field('text') text;
  @field('sentAt') sentAt;
  @field('idMessage') idMessage;
  @field('sender') sender;
  @field('type') type;
  @field('receiverId') receiverId;

  @writer async addMessage(arrayItem) {
    await this.create(item => {
      item.message = arrayItem.text;
      item.time = arrayItem.updatedAt;
      item.idMessage = arrayItem.id;
      item.sender = arrayItem.sender.name;
      item.type = arrayItem.type;
      item.receiverId = arrayItem.receiverId;
    });
  }
}

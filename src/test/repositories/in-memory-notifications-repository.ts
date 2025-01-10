import type { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import type { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) return null;

    return notification;
  }

  async save(notification: Notification) {
    const findNotificationIndex = this.items.findIndex(
      (item) => item.id.toString() === notification.id.toString()
    );

    this.items[findNotificationIndex] = notification;
  }
}

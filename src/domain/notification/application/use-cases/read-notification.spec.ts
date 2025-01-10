import { ReadNotificationUseCase } from './read-notification';
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository';
import { makeNotification } from '@/test/factories/make-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification();
    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString()
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date));
  });
});

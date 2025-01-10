import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { SendNotificationUseCase } from './send-notification';
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Create Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityID('1'),
      title: 'New Notification Title',
      content: 'New Notification Content'
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.notification.title).toEqual('New Notification Title');
    expect(inMemoryNotificationsRepository.items[0].id).toEqual(result.value?.notification.id);
  });
});

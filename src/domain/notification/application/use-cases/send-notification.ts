import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { right, type Either } from '@/core/errors/either';
import { Notification } from '../../enterprise/entities/notification';
import type { NotificationsRepository } from '../repositories/notifications-repository';

type SendNotificationUseCaseRequest = {
  recipientId: UniqueEntityID;
  title: string;
  content: string;
};

type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>;

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId,
      title,
      content
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}

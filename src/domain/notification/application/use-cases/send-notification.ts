import { right, type Either } from '@/core/errors/either';
import { Notification } from '../../enterprise/entities/notification';
import type { NotificationsRepository } from '../repositories/notifications-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type SendNotificationUseCaseRequest = {
  recipientId: string;
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
      recipientId: new UniqueEntityID(recipientId),
      title,
      content
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}

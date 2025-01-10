import { left, right, type Either } from '@/core/errors/either';
import type { NotificationsRepository } from '../repositories/notifications-repository';
import { ResourceNotFoundError } from '@/core/errors/global-errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';

type ReadNotificationUseCaseRequest = {
  recipientId: string;
  notificationId: string;
};

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();
    await this.notificationsRepository.save(notification);

    return right({});
  }
}

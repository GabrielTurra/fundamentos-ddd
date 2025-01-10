import type { Answer } from '@/domain/forum/enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';
import { left, right, type Either } from '@/core/errors/either';
import { ResourceNotFoundError } from '@/core/errors/global-errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import type { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';

type EditAnswerUseCaseRequest = {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
};

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>;

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(
      answer.id.toString()
    );

    const answerAttachmentsList = new AnswerAttachmentList(currentAnswerAttachments);

    const newAnswerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id
      });
    });

    answerAttachmentsList.update(newAnswerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentsList;

    await this.answersRepository.save(answer);

    return right({ answer });
  }
}

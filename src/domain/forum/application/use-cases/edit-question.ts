import type { Question } from '@/domain/forum/enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';
import { ResourceNotFoundError } from '@/core/errors/global-errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';
import { type Either, left, right } from '@/core/errors/either';
import type { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type EditQuestionUseCaseRequest = {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
};

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentsIds
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(question.id.toString());

    const questionAttachmentsList = new QuestionAttachmentList(currentQuestionAttachments);

    const newQuestionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id
      });
    });

    questionAttachmentsList.update(newQuestionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentsList;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}

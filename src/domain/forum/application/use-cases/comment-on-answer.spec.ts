import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository';
import { makeAnswer } from '@/test/factories/make-answer';
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAtachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAtachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAtachmentsRepository);
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

    sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository);
  });

  it('should be able to comment on answer', async () => {
    const newAnswer = makeAnswer();
    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'Comment Answer Content Test'
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Comment Answer Content Test'
    );
  });
});

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository';
import { makeQuestion } from '@/test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });

  it('should be able to comment on question', async () => {
    const newQuestion = makeQuestion();
    await inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      content: 'Comment Question Content Test'
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comment Question Content Test'
    );
  });
});

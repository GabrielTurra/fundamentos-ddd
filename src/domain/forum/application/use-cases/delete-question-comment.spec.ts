import { makeQuestionComment } from '@/test/factories/make-question-comment';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
    expect(inMemoryQuestionCommentsRepository.items[0].id).toEqual(newQuestionComment.id);

    await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: 'author-1'
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question comment from another author', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-2')
    });

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: 'author-1'
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

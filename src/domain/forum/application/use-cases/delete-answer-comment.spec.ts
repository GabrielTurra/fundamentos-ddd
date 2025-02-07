import { makeAnswerComment } from '@/test/factories/make-answer-comment';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/global-errors/not-allowed-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);
    expect(inMemoryAnswerCommentsRepository.items[0].id).toEqual(newAnswerComment.id);

    await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: 'author-1'
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answer comment from another author', async () => {
    const newAnswerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-2')
    });

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    const result = await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: 'author-1'
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

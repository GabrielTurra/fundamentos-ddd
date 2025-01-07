import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  async create(question: Question) {
    this.items.push(question);
  }

  async save(question: Question) {
    const findQuestionIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString()
    );

    this.items[findQuestionIndex] = question;
  }

  async delete(question: Question) {
    const findQuestionIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString()
    );
    this.items.splice(findQuestionIndex, 1);
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    return question;
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) return null;

    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}

import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
  }

  async save(answer: Answer) {
    const findAnswerIndex = this.items.findIndex((item) => item.id.toString() === answer.id.toString());

    this.items[findAnswerIndex] = answer;
  }

  async delete(answer: Answer) {
    const findAnswerIndex = this.items.findIndex((item) => item.id.toString() === answer.id.toString());
    this.items.splice(findAnswerIndex, 1);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) return null;

    return answer;
  }
}

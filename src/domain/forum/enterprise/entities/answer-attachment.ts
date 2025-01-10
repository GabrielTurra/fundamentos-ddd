import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface AnswerAttachmentProps {
  answerId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  set answerId(answerId: string) {
    this.props.answerId = new UniqueEntityID(answerId);
  }

  get attachmentId() {
    return this.props.attachmentId.toString();
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    const answerAttachment = new AnswerAttachment(props, id);
    return answerAttachment;
  }
}

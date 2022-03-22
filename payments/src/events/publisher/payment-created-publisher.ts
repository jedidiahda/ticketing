import { Subjects, Publisher, PaymentCreatedEvent } from "@ticketnpm/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

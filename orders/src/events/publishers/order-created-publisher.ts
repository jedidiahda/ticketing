import { Publisher, OrderCreatedEvent, Subjects } from '@ticketnpm/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}











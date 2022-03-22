import { Publisher, OrderCancelledEvent, Subjects } from '@ticketnpm/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}



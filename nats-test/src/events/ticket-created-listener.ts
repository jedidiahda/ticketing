import { Message } from 'node-nats-streaming';
import { Listener }  from './base-listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  //ts not allow to change type of subject, it must have a type
  //like final in java
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);
    
    msg.ack();
  }
}
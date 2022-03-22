import { Message } from 'node-nats-streaming';
import { Listener }  from './base-listener';
import { Subjects } from './subjects';
import { TicketUpdateEvent } from './ticket-update-event';

export class TicketUpdateListener extends Listener<TicketUpdateEvent>{
  //ts not allow to change type of subject, it must have a type
  //like final in java
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketUpdateEvent['data'], msg: Message): void {
    console.log('Event data!', data);
    
    msg.ack();
  }
}
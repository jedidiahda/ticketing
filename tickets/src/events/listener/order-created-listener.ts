import { Listener, Subjects, OrderCreatedEvent, OrderStatus } from "@ticketnpm/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message){
    //get ticketd that the order reserving
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket, throw error
    if(!ticket){
      throw new Error('Ticket not found');
    }

    //mark the ticket as being reserved by setting its orderid property
    ticket.set({ orderId: data.id });

    //save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    //ack the message
    msg.ack();
  }
}
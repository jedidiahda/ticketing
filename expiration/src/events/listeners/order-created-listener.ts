import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketnpm/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
// import { expirationQueue } from "../../queues/operation-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message){
    //
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('waiting this many millisen ', delay);

    // await expirationQueue.add('order-created',{
    //     orderId: data.id
    //   },{
    //     delay: delay,
    //   });
      msg.ack();
  }

  
}
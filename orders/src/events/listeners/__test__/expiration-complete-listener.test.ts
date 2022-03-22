import mongoose  from "mongoose";
import { Message} from 'node-nats-streaming';
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@ticketnpm/common";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'asdf',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();

  const order = Order.build({
    userId: 'asdf',
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket: ticket
  });

  await order.save();

  const data:ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, ticket, data , msg};
}

it('updates the order status to cancelled', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updateOrder =await Order.findById(order.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('emit an ordercancelled event', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
})

it('ackt the message', async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data,msg);
  expect(msg.ack).toHaveBeenCalled();
})
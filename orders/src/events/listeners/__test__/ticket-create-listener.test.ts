import {  } from 'supertest';
import { Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@ticketnpm/common';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  //create a facke data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'consdf',
    price:10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //create a fack message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg};
}

it('creates and saves a ticket', async() => {
  const { listener, data, msg} = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  //wite assertions to make sure ticket was created!
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  //call the onMessage function with the data object + message object
  await listener.onMessage(data,msg);

  //wite assertions to make sure ticket was created!
  expect(msg.ack).toHaveBeenCalled();
  

});
import {  } from 'supertest';
import { Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {TicketUpdatedListener} from '../../listeners/ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@ticketnpm/common';
const setup = async () => {
  // create an instance of the listener
  
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  // //create a facke data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    price: 3,
    version: ticket.version +1,
    title: 'new',
    userId: ''
  }
  //create a fack message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data,ticket, msg};
}

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, ticket, listener} = await setup();
  await listener.onMessage(data,msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const {msg, data,ticket,listener} = await setup();
  await listener.onMessage(data,msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener, ticket }  = await setup();
  data.version = 10;
  try{
    await listener.onMessage(data, msg);
  }catch(err){

  }

  expect(msg.ack).not.toHaveBeenCalled();
})
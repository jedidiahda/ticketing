import mongoose from 'mongoose';
import request  from "supertest";
import { app } from "../../app";
import {Ticket} from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    title: 'abd',
    price: 20
  })

  await ticket.save();
  return ticket;
}

it('fetches orders for an particular user', async () => {
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  const user1 = (await global.signin()).toString();
  const user2 = (await global.signin()).toString();

  const {body: order1} = await request(app)
  .post(`/api/orders`)
  .set('Cookie', user1)
  .send({ 
    ticketId: t1.id
  })
  .expect(201);

  const { body: order2} = await request(app)
  .post(`/api/orders`)
  .set('Cookie', user2)
  .send({ 
    ticketId: t2.id
  })
  .expect(201);

  const {body: order3} = await request(app)
  .post(`/api/orders`)
  .set('Cookie', user2)
  .send({ 
    ticketId: t3.id
  })
  .expect(201);

  const response = await request(app)
  .get(`/api/orders`)
  .set('Cookie', user2)
  .expect(200);
  // console.log(response.body)
  // console.log(response.body[0])
  // console.log("response",response.body[0].id)
  // console.log("order1",order1.id)
  const id = response.body[0].id;
  expect(response.body.length).toEqual(2);
  // expect(id).toEqual(order1.id);
  // expect(response.body[1].id).toEqual(order2.id);
  // expect(response.body[0].ticket.id).toEqual(t1.id);
  // expect(response.body[1].ticket.id).toEqual(t2.id);
  // expect(response.body[2].ticket.id).toEqual(t3.id);
});

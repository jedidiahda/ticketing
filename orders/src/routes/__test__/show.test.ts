import request from "supertest";
import mongoose from 'mongoose';
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it('fetches the order', async () => {
  //create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id:new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save();

  const user = await global.signin();
  //make a request to build an order with this ticket
  const {body: order} = await request(app)
  .post(`/api/orders`)
  .set('Cookie', user)
  .send({
    ticketId: ticket.id
  })
  .expect(201);

  //make request to fetch the order
  const {body: fetchOrder } = await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', user)
  .send()
  .expect(200);

  expect(fetchOrder.id).toEqual(order.id);

});


it('returns an error if user try to fetch others order', async () => {
  //create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id:new mongoose.Types.ObjectId().toHexString()
  })
  await ticket.save();

  const user = await global.signin();
  //make a request to build an order with this ticket
  const {body: order} = await request(app)
  .post(`/api/orders`)
  .set('Cookie', user)
  .send({
    ticketId: ticket.id
  })
  .expect(201);

  // console.log(response)


  //make request to fetch the order
  const response = await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', await global.signin())
  .send()
  .expect(400);//not authorized

  // console.log(response)


});









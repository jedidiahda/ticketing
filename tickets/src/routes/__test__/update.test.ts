import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';


it('returns a 404 if the provide id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
  .put(`/api/tickets/${id}`)
  .set('Cookie', await global.signin())
  .send({
    title:'asdf',
    price:33
  }).expect(400);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
  .put(`/api/tickets/${id}`)
  .send({
    title:'asdf',
    price:33
  })
  .expect(400);
  // console.log(response);
});

it('returns a 401 if the use does not own the ticket', async () => {
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', await global.signin())
  .send({
    title:'asdf',
    price:33
  });

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie',await global.signin())
  .send({
    title:'alsd',
    price:4334
  })
  .expect(400);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = await global.signin();
  const response =await request(app)
  .post('/api/tickets')
  .set('Cookie',cookie)
  .send({
    title:'alsd',
    price:4334
  });

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie',cookie)
  .send({
    title:'',
    price:4334
  })
  .expect(400);

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie',cookie)
  .send({
    title:'dfghsdf',
    price:-4334
  })
  .expect(400);

});

it('updates the ticket provided valid input', async () => {
  const cookie = await global.signin();
  const response =await request(app)
  .post('/api/tickets')
  .set('Cookie',cookie)
  .send({
    title:'alsd',
    price:4334
  });

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title:'nsadf',
    price:1200
  })
  .expect(200);

  const ticketRes = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send();

  expect(ticketRes.body.title).toEqual('nsadf');
  expect(ticketRes.body.price).toEqual(1200);
});

it('publishes an event', async () => {
  const cookie = await global.signin();
  const response =await request(app)
  .post('/api/tickets')
  .set('Cookie',cookie)
  .send({
    title:'alsd',
    price:4334
  });

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title:'nsadf',
    price:1200
  })
  .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects update if the ticket is reserved', async () => {
  const cookie = await global.signin();
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', await global.signin())
  .send({
    title:'asdf',
    price:33
  });

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie',await global.signin())
  .send({
    title:'alsd',
    price:4334
  })
  .expect(400);
  
});
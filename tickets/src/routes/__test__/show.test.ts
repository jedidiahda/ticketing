import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
  .get(`/api/tickets/${id}`)
  .send()
  .expect(400); //can't override statuscode
  // console.log(response)
});

it('returns the ticket if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', (await global.signin()).toString())
    .send({
      title: 'asdfd',
      price: 33,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual('asdfd');
  expect(ticketRes.body.price).toEqual(33);
});

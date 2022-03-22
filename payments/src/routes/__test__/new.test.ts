import { OrderStatus } from '@ticketnpm/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';



// jest.mock('../../stripe');

it('returns a 404 when puchasing an order that does exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', await global.signin())
    .send({
      tocken: 'asdf',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(400);//404
})


it('returns a 401 when purchasing an order that doesn\'t belong to the user', async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
      status: OrderStatus.Created,
      version: 0,
    });
    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', await global.signin())
    .send({
      tocken: 'asdf',
      orderId: order.id
    })
    .expect(400);//401
  })


it('returns a 400 when purchasing a cacelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId:userId,
    price: 10,
    status: OrderStatus.Cancelled,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', await global.signin(userId))
    .send({
      orderId: order.id,
      tocken: 'askdf'
    })
    .expect(400);


})

//this test is to use real strip api 
it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId:userId,
    price: 20,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  // await request(app)
  //   .post('/api/payments')
  //   .set('Cookie', await global.signin(userId))
  //   .send({
  //     token: 'tok_visa',
  //     orderId: order.id
  //   })
  //   .expect(201);

  
    // console.log(stripe)
    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(20 * 100);
    // expect(chargeOptions.currency).toEqual('usd');

    // const stripeCharges = await stripe.charges.list({ limit: 50 });
    // const stripeCharge = stripeCharges.data.find(charge => {
    //   return charge.amount === 10;
    // })

    // expect(stripeCharge).toBeDefined();
    // expect(stripeCharge!.currency).toEqual('usd');

    // const payment = await Payment.findOne({
    //   orderId: order.id,
    //   stripeId: stripeCharge!.id,
    // });

    // expect(payment).not.toBeNull();
  })
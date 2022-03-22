import mongoose from 'mongoose';
import express,{ Request,Response} from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticketnpm/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders', 
[
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string)=> mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must provided')
],
requireAuth,
validateRequest,
async (req:Request,res:Response) => {
  const { ticketId } = req.body;
  
  //find ticket that user is trying to oder in the database
  const ticket = await Ticket.findById(ticketId);
  
  if(!ticket){
    throw new NotFoundError();
  }
  // make sure that this ticket is not already reserve
  // run query to look at all orders. find an order where
  // the ticket we just found and the orders status is not cancelled.
  // if the we find an order form that means that ticket is reserved
  // $in mongoose db operator
  
  const isReserved = await ticket.isReserved();
  if(isReserved){
    throw new BadRequestError("Ticket is already reserved");
  }
  
  //calculate an expiration date for this order
  const expiration = new Date();
  //15 *60 = 15 minutes
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); //

  //build the order and save it the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: ticket
  });

  await order.save();

  //publish an event saying that an order was created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    userId: order.userId,
    status: order.status as OrderStatus,
    expiresAt: order.expiresAt.toISOString(), //date in UTC timezone
    version: ticket.version,
    ticket:{
      id:ticket.id,
      price: ticket.price,
    }
  });

  res.status(201).send(order);
  // res.send("hi")
});

export { router as newOrderOrder};
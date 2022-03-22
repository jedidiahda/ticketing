import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing','abc',{
  url: 'http://localhost:4222'
}); //stan =instance/client of nats

// @ts-ignore to typescript error on nats
// @ts-ignore
stan.on('connect', async () => {
  console.log('publisher connect to NATS');

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'connect',
  //   price: 20
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event publisheds');
  //   console.log(data);
  // });

  const publisher = new TicketCreatedPublisher(stan);
  try{
    await publisher.publish({
      id: '123',
      title: 'connect',
      price: 20
    })
  }catch(err){
    console.log(err);
  }

})



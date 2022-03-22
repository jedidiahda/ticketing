import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto'; 
import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketUpdateListener } from './events/ticket-update-listener';

// console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

// @ts-ignore
stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATs connection closed!');
    process.exit(); //kick out, exit
  });
  //old code for testing
  // const options = stan
  // .subscriptionOptions()
  // .setManualAckMode(true)
  // .setDeliverAllAvailable()
  // .setDurableName('accounting-service');

  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'queue-group-name',
  //   options
  // );
  
  // // @ts-ignore
  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }

  //   msg.ack();
  // }); 

  new TicketCreatedListener(stan).lisen();
  new TicketUpdateListener(stan).lisen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



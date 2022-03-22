import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

//to connect to mongoose db, we can use auth-mongo-srv
const startUp =async () => {
  console.log('application start')
  if(!process.env.JWT_KEY){
    throw Error('JWT_KEY doesn\'t existed');
  }

  if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined');
  }

  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if(!process.env.NATS_URL){
    throw new Error('NATS_URL must be defined');
  }

  if(!process.env.NATS_CLUSTER_ID){
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  try{
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).lisen();
    new TicketUpdatedListener(natsWrapper.client).lisen();
    new ExpirationCompleteListener(natsWrapper.client).lisen();
    new PaymentCreatedListener(natsWrapper.client).lisen();

    //mongodb is auto created if auth is not created yet
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb is connected")
  }catch( err ){
    console.error(err);
  }

  app.listen(3000, () => {
  
    console.log("app listening to port 3000");
  });

};



startUp();

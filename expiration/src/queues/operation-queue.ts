import Queue from 'bull';

//information of data
interface Payload {
  orderId: string;
}

//type of data to pass to queue
const expirationQueue = new Queue<Payload>('order:expiration',{
  redis:{
    host: process.env.REDIS_HOST,
    // host: "redis://127.0.0.1:6379"
    // enableReadyCheck: false,
    // maxRetriesPerRequest: null
  },
  // limiter: {
  //   max: 1000,
  //   duration: 5000
  // }
});

//job is Payload
expirationQueue.process("order-created",async (job, done) => {
  console.log('i want to publish an expiration: complete event for orderId', job.data.orderId);
  job.moveToCompleted('done', true)
});

expirationQueue.on('progress', (job: any, progress: any) => {
  console.log(`${job.id} is in progress`)
})

export { expirationQueue };



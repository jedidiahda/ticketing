import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app} from '../app';

// declare global{
//   namespace NodeJs{
//     interface Global{
//       signin(): Promise<string[]>;
//     }
//   }
// }

declare global {
  var signin: () => Promise<string[]>;
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async ()=> {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach( async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections){
    await collection.deleteMany({});
  }

});

afterAll( async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin =async () => {
  // const email = 'test@test.com';
  // const password = 'password';

  // const response = await request(app)
  // .post('/api/users/signup')
  // .send({
  //   email,password
  // })
  // .expect(201);

  // const cookie = response.get('Set-Cookie');
  // console.log("cookie", response)

  // return cookie[0].toString();
  /**
   * {"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGIyYmQyY2Y4ZjBhNDM2NDk5NzVmZSIsImVtYWlsIjoiYXNkZkBzZGpmYXNkZi5jb20iLCJpYXQiOjE2NDQ4OTkyODJ9.wxYqS-32LZ2MgaeeAoCmexjtCk2MAOD_PiUetzvZ_Fo"}
   */
  
  // const payload = {
  //   id:'33454',
  //   email: 'test@test.com'
  // };
  // const token = jwt.sign(payload, process.env.JWT_KEY!);
  // const session = { jwt: token};
  // const sessionJSON = JSON.stringify(session);
  // const base64 = Buffer.from(sessionJSON).toString('base64');
  // return `express:sess=${base64}`;

    // Build a JWT payload.  { id, email }
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com',
    };
  
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
  
    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
  
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
  
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
  
    // return a string thats the cookie with the encoded data
    return [`session=${base64}; path=/; httponly`];

}
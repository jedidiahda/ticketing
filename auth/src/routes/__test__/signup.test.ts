import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return 
    request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  await 
    request(app)
    .post('/api/users/signup')
    .send({
      email: 'testdee.com',
      password: 'password'
    })
    .expect(400);
});


it('returns a 400 with an invalid password', async () => {
  await 
    request(app)
    .post('/api/users/signup')
    .send({
      email: 'dta@dee.com',
      password: ''
    })
    .expect(400);
});

it('returns a 400 with an invalid email & password', async () => {
  await
  request(app)
  .post('/api/users/signup')
  .send({
    email: 'dta@dee.com'
  })
  .expect(400);
  await 
    request(app)
    .post('/api/users/signup')
    .send({
      password: '1234'
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'bq@test.com',
      password: 'password'
    });
    // .expect(201);//ex1

  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'bq@test.com',
      password: 'password'
    })
    .expect(400);//ex2
  
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'bq@test.com',
      password: 'password'
    });
    // .expect(201);//ex1

    // console.log(process.env.NODE_ENV);

    expect(response.get('Set-Cookie')).toBeDefined();
  
});

